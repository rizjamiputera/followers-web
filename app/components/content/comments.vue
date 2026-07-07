<template>
    <div ref="sectionRef">
        <div class="font-cinzel tracking-wide text-2xl md:text-3xl font-semibold text-green-main">
            <!-- TODO CONTENT STATS, buat content store, supaya bisa update comment count tanpa memikirkan dari artikel / event -->
            <span v-if="stats">{{ `${stats.commentCount} ` }}</span>Comments
        </div>
        <hr class="bg-green-main/30 mb-5">

        <!-- Write Comment -->
        <div class="mb-8" v-if="user">
            <div class="flex gap-3">
                <Avatar :avatar="user.avatar_md" :name="user.name" class="w-9 h-9 shrink-0 max-sm:hidden" />
                <div class="flex-1">
                    <Textarea v-model="comment" placeholder="Tulis komentar yang baik..." />
                    <div class="flex justify-end mt-2">
                        <Button class="btn-green btn-sm font-cinzel tracking-wide" :disabled="!comment.trim()"
                            @click="submit">Kirim</Button>
                    </div>
                </div>
            </div>
        </div>
        <ButtonLink v-else to="/auth/login" class="btn-green w-full mb-8">
            Login untuk memberikan komentar positif
        </ButtonLink>

        <div v-if="comments.length === 0 && !isLoading" class="text-center text-gray-400 py-8">
            <div class="text-4xl mb-2">💬</div>
            Belum ada komentar. Jadilah yang pertama!
        </div>

        <div v-else class="flex flex-col gap-6">
            <div v-for="comment in comments" :key="comment.id" class="flex flex-col gap-3">
                <ContentComment :comment @reply="openReply(comment)" @delete="askDelete(comment)" />

                <!-- Replies (single level, Instagram-style) with a thread line -->
                <div v-if="comment.replies && comment.replies.length > 0"
                    class="flex flex-col gap-3 ml-[1.125rem] pl-6 border-l-2 border-gray-100">
                    <ContentComment v-for="reply in comment.replies" :key="reply.id" :comment="reply" compact
                        @reply="openReply(comment, reply)" @delete="askDelete(reply, comment)" />
                </div>

                <!-- Reply composer -->
                <div v-if="user && replyTarget?.topLevelId === comment.id"
                    class="ml-[1.125rem] pl-6 border-l-2 border-green-main/20">
                    <div v-if="replyTarget.mentioned"
                        class="text-xs text-gray-500 mb-1.5 flex items-center gap-1.5">
                        <LucideCornerDownRight :size="13" class="text-gray-400" />
                        Membalas
                        <span class="font-medium text-green-main">@{{ replyTarget.mentioned.name }}</span>
                        <button type="button" @click="cancelReply"
                            class="text-gray-400 hover:text-gray-600 ml-0.5 cursor-pointer">✕</button>
                    </div>
                    <Textarea v-model="replyText" placeholder="Tulis balasan..." />
                    <div class="flex justify-end gap-2 mt-2">
                        <Button class="btn-ghost btn-sm" @click="cancelReply">Batal</Button>
                        <Button class="btn-green btn-sm font-cinzel tracking-wide"
                            :disabled="!replyText.trim() || replySubmitting" @click="submitReply(comment)">
                            <span v-if="replySubmitting" class="loading loading-spinner loading-xs"></span>
                            Balas
                        </Button>
                    </div>
                </div>
            </div>

            <ContentCommentSkeleton v-if="isLoading" v-for="n in 3" :key="n" />

            <div class="flex justify-center" v-if="!isLoading && comments.length < total">
                <Button class="btn-sm btn-outline-green text-nowrap w-min" @click="loadMore">Muat komentar lain</Button>
            </div>
        </div>

        <!-- Delete confirm -->
        <Modal :show="!!deleteTarget" @close="deleteTarget = null">
            <div class="p-6">
                <h3 class="text-lg font-semibold mb-2">Hapus Komentar</h3>
                <p class="text-sm text-gray-600 mb-4">
                    Yakin ingin menghapus komentar ini?
                    <span v-if="deleteTarget && !deleteTarget.parent">Balasan pada komentar ini juga akan terhapus.</span>
                </p>
                <div class="flex justify-end gap-2">
                    <Button class="btn-ghost" @click="deleteTarget = null">Batal</Button>
                    <Button class="btn-error" :disabled="deleting" @click="confirmDelete">
                        <span v-if="deleting" class="loading loading-spinner loading-xs"></span>
                        Hapus
                    </Button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts" setup>
import { LucideCornerDownRight } from 'lucide-vue-next';
import type { Comment, ContentStats } from '~/interfaces/content-interface';
const { user } = useAuthStore();

const emits = defineEmits(['addComment'])
const sectionRef = ref<HTMLElement>();
const props = defineProps<{
    contentId: string
    stats?: ContentStats
}>()

const CommentsStore = useCommentsStore();
const { get } = CommentsStore;

const { isLoading, comments, total } = storeToRefs(CommentsStore);
const { loadMore } = CommentsStore;
CommentsStore.contentId = props.contentId;
CommentsStore.parameters.page = 1;

onMounted(get);

// FORM
const comment = ref<string>('');
const submit = async () => {
    if (!props.stats) return;
    try {
        const newCommnet: Comment = await Api.post('/v1/comment?includes=user', {
            contentId: props.contentId,
            comment: comment.value,
            statsId: props.stats.id
        }) as Comment;

        comments.value = [
            newCommnet,
            ...comments.value,
        ]

        comment.value = '';

        emits('addComment');
    } catch (error) {

    }
}

// REPLY (single level, Instagram-style: always attaches to the top-level
// comment; replying to a reply just mentions that reply's author)
const replyTarget = ref<{ topLevelId: string; mentioned?: { id: string; name: string } } | null>(null);
const replyText = ref<string>('');
const replySubmitting = ref<boolean>(false);

const openReply = (topLevel: Comment, reply?: Comment) => {
    if (!user) return;
    const mentioned = reply?.user
        ? { id: reply.user.id, name: reply.user.name ?? '' }
        : undefined;
    replyTarget.value = { topLevelId: topLevel.id, mentioned };
    replyText.value = '';
};

const cancelReply = () => {
    replyTarget.value = null;
    replyText.value = '';
};

// DELETE (author or admin). Deleting a top-level comment also removes its
// replies (handled by the backend); mirror that in local state.
const deleteTarget = ref<{ comment: Comment; parent?: Comment } | null>(null);
const deleting = ref<boolean>(false);

const askDelete = (comment: Comment, parent?: Comment) => {
    deleteTarget.value = { comment, parent };
};

const confirmDelete = async () => {
    if (!deleteTarget.value || deleting.value) return;
    const { comment, parent } = deleteTarget.value;
    deleting.value = true;
    try {
        await Api.remove('/v1/comment/' + comment.id);

        if (parent) {
            parent.replies = (parent.replies ?? []).filter(r => r.id !== comment.id);
        } else {
            comments.value = comments.value.filter(c => c.id !== comment.id);
        }

        deleteTarget.value = null;
        emits('addComment'); // resync stats (comment count)
    } catch (error) {
        // Api.handleError surfaces the error
    } finally {
        deleting.value = false;
    }
};

const submitReply = async (topLevel: Comment) => {
    if (!props.stats || !replyTarget.value) return;
    const text = replyText.value.trim();
    if (!text || replySubmitting.value) return;

    replySubmitting.value = true;
    try {
        const newReply = await Api.post('/v1/comment?includes=user', {
            contentId: props.contentId,
            comment: text,
            statsId: props.stats.id,
            parentId: replyTarget.value.topLevelId,
            mentionedId: replyTarget.value.mentioned?.id,
        }) as Comment;

        // The create endpoint doesn't return `mentioned`; attach it locally.
        if (replyTarget.value.mentioned) {
            newReply.mentioned = {
                id: replyTarget.value.mentioned.id,
                name: replyTarget.value.mentioned.name,
            } as any;
        }

        if (!topLevel.replies) topLevel.replies = [];
        topLevel.replies.push(newReply);

        cancelReply();
        emits('addComment');
    } catch (error) {
        // Api.handleError already surfaces the error
    } finally {
        replySubmitting.value = false;
    }
};
</script>

<style scoped></style>
