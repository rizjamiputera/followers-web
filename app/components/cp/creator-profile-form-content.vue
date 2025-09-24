<template>
    <div class="flex flex-col gap-4">
        <Input v-model="dataDto.slug" label="Username" @keyup="checkSlugChange" />

        <div>
            <label class="text-sm font-medium">Specializations</label>
            <p class="text-xs font-light mb-1">
                Bidang keahlian creator
            </p>
            <TagInput v-model="specializationTags" placeholder="Ketik untuk menambah spesialisasi..." :max-tags="10" />
        </div>

        <div>
            <label class="text-sm font-medium">Social Links</label>
            <div class="flex flex-col gap-2 mt-2">
                <div v-for="(link, index) in dataDto.socialLinks" :key="index"
                    class="flex gap-2 items-center flex-wrap">
                    <select v-model="link.platform" class="select select-sm select-bordered flex-shrink-0">
                        <option v-for="platform in socialPlatforms" :key="platform" :value="platform">
                            {{ platform }}
                        </option>
                    </select>
                    <Input v-model="link.handle" placeholder="@username" class="flex-1 min-w-40" />
                    <Input v-model="link.url" placeholder="https://..." class="flex-1 min-w-60" />
                    <Button @click="removeSocialLink(index)" class="btn-sm btn-error">
                        Remove
                    </Button>
                </div>
                <Button @click="addSocialLink" class="btn-sm btn-outline w-fit">
                    + Add Social Link
                </Button>
            </div>
        </div>

        <div v-if="dataDto.biography?.content">
            <label class="text-sm font-medium">Biography</label>
            <TiptapEditor v-model="dataDto.biography.content" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Profile, SocialLink, SocialPlatform } from '~/interfaces/user-interface';

const props = defineProps<{
    userId?: string;
}>();

const dataDto = ref<Partial<Profile>>({
    biography: {
        content: {
            content: [],
            type: 'doc'
        },
    },
    specializations: [],
    socialLinks: [],
});

const specializationTags = ref<string[]>([]);
const socialPlatforms = ['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'YOUTUBE', 'TIKTOK', 'LINKEDIN', 'TELEGRAM', 'WHATSAPP', 'WEBSITE'];

const profile = ref<Profile | undefined>(undefined);

const get = async () => {
    try {
        const endpoint = props.userId
            ? `/v1/creator/${props.userId}?includes=biography,socialLinks,user`
            : `/v1/creator/my/profile?includes=biography,socialLinks`;

        profile.value = await Api.get(endpoint) as Profile;
    } catch (error) {
        console.error('Failed to load profile:', error);
    }
};

onMounted(get);

watch(profile, (newProfile) => {
    if (newProfile) {
        dataDto.value.slug = newProfile.slug;
        dataDto.value.biography = { content: newProfile.biography?.content ?? { type: 'doc', content: [] } };
        dataDto.value.specializations = newProfile.specializations ?? [];
        dataDto.value.socialLinks = newProfile.socialLinks
            ? newProfile.socialLinks.map((link: any) => {
                const { id, profileId, ...rest } = link;
                return rest;
            })
            : [];

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

const getData = () => dataDto.value;

defineExpose({
    getData,
    profile
});
</script>

<style></style>
