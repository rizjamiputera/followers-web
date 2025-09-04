<template>
    <div ref="sectionRef">
        <div class="text-2xl md:text-3xl font-semibold text-green-main">
            <!-- TODO CONTENT STATS, buat content store, supaya bisa update comment count tanpa memikirkan dari artikel / event -->
            <span v-if="stats">{{ `${stats.commentCount} ` }}</span>Comments
        </div>
        <hr class="bg-green-main/30 mb-5">

        <!-- Write Comment -->
        <div class="mb-4" v-if="user">
            <Textarea v-model="comment" placeholder="Type comment here.." />
            <div class="flex justify-end mt-2">
                <Button class="btn-green" @click="submit">Submit</Button>
            </div>
        </div>
        <ButtonLink v-else to="/auth/login" class="btn-green w-full">
            Login untuk memberikan komentar positif
        </ButtonLink>

        <div v-if="comments.length === 0" class="text-gray-400">
            Belum ada komentar
        </div>

        <div v-else class="flex flex-col gap-1">
            <div v-for="comment in comments" :key="comment.id">
                <ContentComment :comment />

                <!-- Second level comments (replies) -->
                <div v-if="comment.replies && comment.replies.length > 0" class="flex flex-col gap-1 pl-10">
                    <template v-for="reply in comment.replies" :key="reply.id">
                        <ContentComment :comment="reply" />
                    </template>
                </div>
            </div>

            <ContentCommentSkeleton v-if="isLoading" v-for="n in 3" :key="n" />

            <div class="flex justify-center" v-if="stats && (stats.commentCount > comments.length)">
                <Button class="btn-sm btn-green text-nowrap w-min" @click="loadMore">Load more comments</Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
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

const { isLoading, comments } = storeToRefs(CommentsStore);
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
</script>

<style scoped></style>
