<template>
    <NuxtLink :to="'/read/' + data.slug" prefetch-on="interaction"
        class="w-full flex sm:flex-col gap-2 border border-green-main/30 rounded-xl p-3">
        <Image :src="data.image_md"
            class="w-33 sm:w-full aspect-4/3 sm:aspect-video rounded-lg bg-cover bg-no-repeat" />
        <div class="flex-1 flex flex-col gap-2">
            <div class="flex justify-start sm:justify-between gap-2 text-xs">
                <AvatarPublishedAt :data="data" class="text-xs" avatar_width="w-5 h-5" />
            </div>
            <div class="flex-1 flex flex-col gap-2">
                <DefaultBody class="line-clamp-1 font-bold">{{ data.title }}</DefaultBody>
                <DefaultBody class="line-clamp-3">{{ data.excerpt }}</DefaultBody>
            </div>

            <TagList v-if="data.tags" :tags="data.tags" :clickable="false" size="sm" />
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup>
import { DefaultBody } from '#components';
import type { Article } from '~/interfaces/article-interface';

defineProps<{
    data: Article
}>()
</script>
