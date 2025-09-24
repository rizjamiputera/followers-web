<template>
    <Modal :show="show" @close="$emit('close')" max-width="max-w-4xl">
        <div class="flex flex-col gap-4 p-2">
            <h2 class="text-2xl font-bold">Edit Creator Profile</h2>

            <CpCreatorProfileFormContent ref="formRef" />

            <div class="modal-action">
                <Button @click="$emit('close')">Cancel</Button>
                <Button class="btn-green" @click="validate()" :disabled="isSubmitting">
                    <LucideLoader :size="20" v-show="isSubmitting" class="animate-spin" />
                    Simpan
                </Button>
            </div>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import Joi from 'joi';
import { LucideLoader } from 'lucide-vue-next';

const props = defineProps<{
    show: boolean;
}>();

const emit = defineEmits<{
    close: [];
}>();

const formRef = ref<any>(null);

const isProfile = Joi.object({
    username: IsString.max(100),
    specializations: Joi.array().items(Joi.string()).optional(),
    socialLinks: Joi.array().items(Joi.object({
        platform: Joi.string().required(),
        url: Joi.string().uri().required(),
        handle: Joi.string().optional().allow('', null)
    })).optional(),
    biography: IsContent
});

const isSubmitting = ref<boolean>(false);
const validatedData = ref<Record<string, any>>({});

const validate = () => {
    try {
        const dataDto = formRef.value?.getData();
        validatedData.value = Validate(isProfile, dataDto);
        validatedData.value.biography = validatedData.value.biography.content;

        submit();
    } catch (error) {
        toastError(error);
    }
};

const submit = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    try {
        await Api.patch(`/v1/creator/my/profile`, validatedData.value);

        toastSuccess('Profile updated successfully');

        emit('close');
    } catch (error) {
        toastError(error);
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style></style>
