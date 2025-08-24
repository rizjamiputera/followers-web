<template>
    <div ref="sectionRef">
        <div class="text-2xl md:text-3xl font-semibold text-green-main">
            <span>{{ `${stats.commentCount} ` }}</span>Comments
        </div>
        <hr class="bg-green-main/30 mb-5">

        <!-- Write Comment -->
        <div class="mb-4" v-if="user">
            <Textarea placeholder="Type comment here.." />
            <div class="flex justify-end mt-1">
                <Button class="btn-green">Submit</Button>
            </div>
        </div>
        <ButtonLink to="/auth/login" class="btn-green w-full">Login to write comment</ButtonLink>

        <div v-if="CommentsStore.comments.length === 0" class="no-comments">
            No comments yet
        </div>

        <div v-else class="flex flex-col gap-1">
            <div v-for="comment in CommentsStore.comments" :key="comment.id">
                <Comment :comment />

                <!-- Second level comments (replies) -->
                <div v-if="comment.replies && comment.replies.length > 0" class="flex flex-col gap-1 pl-10">
                    <template v-for="reply in comment.replies" :key="reply.id">
                        <Comment :comment="reply" />
                    </template>
                </div>
            </div>

            <CommentSkeleton v-if="isLoading" v-for="n in 3" :key="n" />

            <div class="flex justify-center" v-if="stats.commentCount > CommentsStore.comments.length">
                <Button class="btn-sm btn-green text-nowrap w-min" @click="loadMore">Load more comments</Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { ContentStats } from '~/interfaces/content-interface';
import Comment from '../comment.vue';
const { user } = useAuthStore();

const sectionRef = ref<HTMLElement>();
const props = defineProps<{
    contentId: string
    stats: ContentStats
}>()

const CommentsStore = useCommentsStore();
const { get } = CommentsStore;

const { isLoading } = storeToRefs(CommentsStore);
const { loadMore } = CommentsStore;
CommentsStore.contentId = props.contentId;
CommentsStore.parameters.page = 1;

onMounted(get);
</script>

<style scoped></style>
