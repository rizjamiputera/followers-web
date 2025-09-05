<template>
    <div class="font-cinzel">
        <slot />
    </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

div {
    /* @apply text-[2.7rem] font-medium; */
    /* @apply text-[44px] font-medium leading-13; */
    @apply text-[30px] sm:text-[28px] lg:text-[35px] xl:text-[39px] font-semibold tracking-wider;
}
</style>
