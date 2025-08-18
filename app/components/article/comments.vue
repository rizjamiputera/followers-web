<template>
    <div ref="sectionRef">
        <div class="text-2xl md:text-3xl font-semibold text-green-main">
            <span>{{ `${stats.commentCount} ` }}</span>Comments
        </div>
        <hr class="bg-green-main/30 mb-5">
        <div class="mb-4">
            <Textarea placeholder="Type comment here.." />
            <div class="flex justify-end mt-1">
                <Button class="btn-green">Submit</Button>
            </div>
        </div>
        <div v-if="isLoading" class="loading">
            Loading comments...
        </div>

        <div v-else-if="ArticleCommentsStore.comments.length === 0" class="no-comments">
            No comments yet
        </div>

        <div v-else class="flex flex-col gap-1">
            <div v-for="comment in ArticleCommentsStore.comments" :key="comment.id">
                <Comment :comment />

                <!-- Second level comments (replies) -->
                <div v-if="comment.replies && comment.replies.length > 0" class="flex flex-col gap-1 pl-10">
                    <template v-for="reply in comment.replies" :key="reply.id">
                        <Comment :comment="reply" />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const sectionRef = ref<HTMLElement>();
const props = defineProps<{
    articleId: string
}>()
const ReadArticleStore = useReadArticleStore();
const { stats } = storeToRefs(ReadArticleStore);

const ArticleCommentsStore = useArticleCommentsStore();
const { get } = ArticleCommentsStore;

const { isLoading } = storeToRefs(ArticleCommentsStore);
ArticleCommentsStore.articleId = props.articleId;
ArticleCommentsStore.parameters.page = 1;
get();

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
}

</script>

<style scoped></style>
