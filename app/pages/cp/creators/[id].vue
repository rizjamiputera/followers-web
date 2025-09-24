<template>
    <div class="flex flex-col gap-3 relative">
        <div class="flex justify-between items-center gap-3">
            <div>
                <p class="text-gray-600 font-bold" v-if="profile?.user">
                    {{ profile.user.name }} ({{ profile.user.email }})
                </p>
            </div>
            <div class="flex flex-wrap gap-1">
                <Button class="max-sm:btn-sm" @click="confirm_cancel = true">Cancel</Button>
                <Button class="max-sm:btn-sm btn-green" @click="validate()">
                    Simpan
                </Button>
            </div>
        </div>

        <CpCreatorProfileFormContent ref="formRef" :userId="id" />

        <div class="flex flex-wrap justify-end gap-1">
            <Button class="max-sm:btn-sm" @click="confirm_cancel = true">Cancel</Button>
            <Button class="max-sm:btn-sm btn-green" @click="validate()">
                Simpan
            </Button>
        </div>
    </div>

    <LazyModal v-if="confirm_cancel" :show="confirm_cancel" @close="confirm_cancel = false">
        Are you sure to discard?
        <div class="modal-action">
            <Button @click="confirm_cancel = false">Lanjutkan</Button>
            <ButtonLink to="/cp/creators" class="btn-green">
                Yes
            </ButtonLink>
        </div>
    </LazyModal>

    <LazyModal v-if="showConfirmSave" :show="showConfirmSave" @close="showConfirmSave = false">
        Yakin simpan perubahan profile?
        <div class="modal-action">
            <Button @click="showConfirmSave = false" :disabled="isSubmitting">No</Button>
            <Button @click="submit" :disabled="isSubmitting" class="btn-green">
                <LucideLoader :size="20" v-show="isSubmitting" class="animate-spin" />
                Simpan
            </Button>
        </div>
    </LazyModal>
</template>

<script lang="ts" setup>
import Joi from 'joi';
import { LucideLoader } from 'lucide-vue-next';
import type { Profile } from '~/interfaces/user-interface';
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            if (!auth.can(Module.USER, Permission.EDIT)) {
                return navigateTo('/cp')
            }
        }
    ]
});

const route = useRoute();
const id = route.params.id as string;

const formRef = ref<any>(null);
const profile = computed(() => formRef.value?.profile);

const isProfile = Joi.object({
    slug: IsString.max(100),
    specializations: Joi.array().items(Joi.string()).optional(),
    socialLinks: Joi.array().items(Joi.object({
        platform: Joi.string().required(),
        url: Joi.string().uri().required(),
        handle: Joi.string().optional().allow('', null)
    })).optional(),
    biography: IsContent
});

const confirm_cancel = ref<boolean>(false);
const showConfirmSave = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);
const validatedData = ref<Record<string, any>>({});

const validate = () => {
    showConfirmSave.value = false;

    try {
        const dataDto = formRef.value?.getData();
        validatedData.value = Validate(isProfile, dataDto);
        validatedData.value.biography = validatedData.value.biography.content;

        showConfirmSave.value = true;
    } catch (error) {
        toastError(error);
    }
};

const submit = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    try {
        await Api.patch(`/v1/creator/${id}`, validatedData.value);

        toastSuccess('Profile updated successfully');

        location.reload();
    } catch (error) {
        toastError(error);
    } finally {
        isSubmitting.value = false;
        showConfirmSave.value = false;
    }
};
</script>

<style></style>
