<template>
    <div>
        <slot />
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

div {
    /* @apply text-[2.7rem] font-medium; */
    /* @apply text-[44px] font-medium leading-13; */
    @apply text-[30px] sm:text-[28px] lg:text-[35px] xl:text-[39px] font-medium leading-8 sm:leading-8 lg:leading-10 xl:leading-12;
}
</style>
