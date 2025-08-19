<template>
    <Teleport defer to="#__nuxt">
        <input type="checkbox" v-model="_show" class="modal-toggle" />
        <div class="modal" role="dialog">
            <div class="modal-box w-11/12 py-10 bg-transparent shadow-none h-screen max-h-screen overflow-hidden flex flex-col justify-center text-white"
                :class="maxWidth">
                <div
                    class="rounded-xl bg-[#171d34]/90 border-1 border-green-main p-4 relative shadow-lg shadow-black/40 h-min max-h-full overflow-y-auto ">
                    <form method="dialog">
                        <button @click="$emit('close')"
                            class="btn btn-xs btn-circle btn-ghost absolute right-2 top-2 bg-gray-500 text-[#171d34]">✕</button>
                    </form>
                    <slot />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
const emit = defineEmits(['close']);

interface Props {
    show: boolean
    maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
    maxWidth: '',
})
const _show = ref<boolean>(false);

watchEffect(() => {
    _show.value = props.show;
})

</script>

<style></style>
