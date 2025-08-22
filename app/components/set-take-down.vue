<template>
    <LazyModal v-if="show" :show="show" @close="$emit('close')">
        Yakin take down?
        <div class="modal-action">
            <Button @click="$emit('close')" :disabled="isSubmitting">No</Button>

            <Button @click="submit" :disabled="isSubmitting" class="btn-black">
                <LucideLoader :size="20" v-show="isSubmitting" class="animate-spin" />
                Simpan
            </Button>
        </div>
    </LazyModal>
</template>

<script lang="ts" setup>
import { LucideLoader } from 'lucide-vue-next';
import { Module, Permission } from '~/interfaces/user-interface';

const emits = defineEmits(['close', 'submited'])
const props = defineProps<{
    articleId: string
    show: boolean
}>()

const AuthStore = useAuthStore();
const canCreateArticle = computed(() => AuthStore.can(Module.ARTICLE, Permission.CREATE));

const isSubmitting = ref<boolean>(false);
const submit = async () => {
    if (canCreateArticle.value) {
        await Api.post('/v1/article/take-down/' + props.articleId);

        emits('submited')
    }
}
</script>

<style></style>
