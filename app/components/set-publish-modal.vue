<template>
    <LazyModal v-if="canPublish && show" :show @close="$emit('close')">
        <div class="flex flex-col gap-2">
            <div>Yakin publish artikel ini?</div>
            <div class="text-sm h-[350px]">
                Atur Jadwal:
                <DateTimePicker v-model="publishedAt" />
            </div>
        </div>

        <div class="modal-action">
            <Button @click="showConfirmPublish = false" :disabled="isSubmitting">No</Button>

            <!-- publish -->
            <Button @click="submit" :disabled="isSubmitting" class="btn-green">
                <LucideLoader :size="20" v-show="isSubmitting" class="animate-spin" />
                Publish
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
const canPublish = computed(() => AuthStore.can(Module.ARTICLE, Permission.APPROVE));
const showConfirmPublish = ref<boolean>(props.show);
const publishedAt = ref<string | null>(null)

const isSubmitting = ref<boolean>(false);

const submit = async () => {
    if (canPublish.value) {
        await Api.post('/v1/article/publish/' + props.articleId, { publishedAt: publishedAt.value });

        emits('submited')
    }
}

</script>

<style></style>
