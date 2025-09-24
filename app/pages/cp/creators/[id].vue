<template>
    <div class="flex flex-col gap-3 relative">
        <div class="flex justify-between items-center gap-3">
            <div>
                <h1 class="text-2xl font-bold">Edit Creator Profile</h1>
                <p class="text-sm text-gray-600" v-if="profile?.user">{{ profile.user.name }} ({{ profile.user.email }})
                </p>
            </div>
            <div class="flex flex-wrap gap-1">
                <Button class="max-sm:btn-sm" @click="confirm_cancel = true">Cancel</Button>
                <Button class="max-sm:btn-sm btn-green" @click="validate()">
                    Simpan
                </Button>
            </div>
        </div>

        <div class="w-full flex flex-col gap-4">
            <Input v-model="dataDto.slug" label="Slug" @keyup="checkSlugChange" />

            <div class="flex items-center gap-2">
                <input type="checkbox" v-model="dataDto.isPublic" class="checkbox checkbox-sm" />
                <label class="text-sm font-medium">Public Profile</label>
            </div>

            <div>
                <label class="text-sm font-medium">Specializations</label>
                <p class="text-xs font-light mb-1">
                    Bidang keahlian creator (pisahkan dengan koma)
                </p>
                <TagInput v-model="specializationTags" placeholder="Ketik untuk menambah spesialisasi..."
                    :max-tags="10" />
            </div>

            <div>
                <label class="text-sm font-medium">Social Links</label>
                <div class="flex flex-col gap-2 mt-2">
                    <div v-for="(link, index) in dataDto.socialLinks" :key="index" class="flex gap-2 items-center">
                        <select v-model="link.platform" class="select select-sm select-bordered flex-shrink-0">
                            <option v-for="platform in socialPlatforms" :key="platform" :value="platform">
                                {{ platform }}
                            </option>
                        </select>
                        <Input v-model="link.handle" placeholder="@username" class="flex-1" />
                        <Input v-model="link.url" placeholder="https://..." class="flex-1" />
                        <Button @click="removeSocialLink(index)" class="btn-sm btn-error">
                            Remove
                        </Button>
                    </div>
                    <Button @click="addSocialLink" class="btn-sm btn-outline">
                        + Add Social Link
                    </Button>
                </div>
            </div>

            <div v-if="dataDto.biography?.content">
                <label class="text-sm font-medium">Biography</label>
                <TiptapEditor v-model="dataDto.biography.content" />
            </div>
        </div>

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
import type { Profile, SocialLink, SocialPlatform } from '~/interfaces/user-interface';
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            console.log('auth.user.role')
            console.log(auth.user?.role)
            if (!auth.can(Module.USER, Permission.EDIT)) {
                return navigateTo('/cp')
            }
        }
    ]
});

const router = useRouter();
const route = useRoute();
const id = route.params.id as string;

const profile = ref<Profile | undefined>(undefined);
const dataDto = ref<Partial<Profile>>({
    biography: {
        content: {
            content: [],
            type: 'doc'
        },
    },
    specializations: [],
    socialLinks: [],
    isPublic: false
});

const specializationTags = ref<string[]>([]);
const socialPlatforms = ['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'YOUTUBE', 'TIKTOK', 'LINKEDIN', 'TELEGRAM', 'WHATSAPP', 'WEBSITE'];

const get = async () => {
    if (!id) return;

    profile.value = await Api.get(`/v1/creator/${id}?includes=biography,socialLinks,user`) as Profile;
};

onMounted(get);

watch(profile, (newProfile) => {
    if (newProfile) {
        dataDto.value.slug = newProfile.slug;
        dataDto.value.isPublic = newProfile.isPublic ?? false;
        dataDto.value.biography = { content: newProfile.biography?.content ?? { type: 'doc', content: [] } };
        dataDto.value.specializations = newProfile.specializations ?? [];
        dataDto.value.socialLinks = newProfile.socialLinks ?? [];

        specializationTags.value = newProfile.specializations ?? [];
    }
}, { immediate: true });

watch(specializationTags, (newTags) => {
    dataDto.value.specializations = newTags;
}, { deep: true });

const checkSlugChange = () => {
    dataDto.value.slug = slugify(dataDto.value.slug ?? '');
};

const addSocialLink = () => {
    if (!dataDto.value.socialLinks) {
        dataDto.value.socialLinks = [];
    }
    dataDto.value.socialLinks.push({
        platform: 'INSTAGRAM' as SocialPlatform,
        url: '',
        handle: ''
    });
};

const removeSocialLink = (index: number) => {
    dataDto.value.socialLinks?.splice(index, 1);
};

const isProfile = Joi.object({
    slug: IsString.max(100),
    isPublic: Joi.boolean(),
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
        validatedData.value = Validate(isProfile, dataDto.value);
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

        await get();
    } catch (error) {
        toastError(error);
    } finally {
        isSubmitting.value = false;
        showConfirmSave.value = false;
    }
};
</script>

<style></style>
