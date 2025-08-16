<template>
    <div>
        <DefaultTitle>
            <slot name="title" />
        </DefaultTitle>
        <DefaultBody class="font-light mt-2 md:mt-4">
            <slot name="subtitle" />
        </DefaultBody>
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

div {
    @apply max-w-4xl mx-auto;
}
</style>
