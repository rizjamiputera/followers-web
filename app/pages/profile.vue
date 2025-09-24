<template>
    <section class="flex flex-col gap-4">
        <div class="flex gap-3">
            <ClientOnly>
                <Avatar :avatar="user?.avatar_md" :name="user?.name" class="w-20 h-20" />
                <div class="flex flex-col gap-1">
                    <div class="text-sm">{{ user?.name }}</div>
                    <div class="text-sm">{{ user?.email }}</div>
                    <div>
                        <div class="badget badge-sm badge-green rounded-full text-sm w-min">{{ user?.role }}</div>
                    </div>
                </div>
            </ClientOnly>
        </div>

        <div class="flex gap-2">
            <Button class="btn-circle btn-green btn-sm" @click="showChangeProfile = true">
                <LucidePencil :size="14" />
            </Button>
            <Button class="btn-green btn-sm" @click="fileInput?.click()">
                Ganti Foto
            </Button>
            <Button class="btn-green btn-sm" @click="showChangePassword = true">
                <LucideKey :size="16" /> Ganti Password
            </Button>
        </div>

        <!-- Creator Profile Section -->
        <div v-if="creatorProfile" class="border-t pt-4 mt-4">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Creator Profile</h2>
                <Button class="btn-sm btn-green" @click="showEditCreatorProfile = true">
                    <LucidePencil :size="14" /> Edit Profile
                </Button>
            </div>

            <div class="flex flex-col gap-3">
                <div>
                    <label class="text-sm font-medium text-gray-600">Username</label>
                    <p>{{ creatorProfile.slug }}</p>
                </div>

                <div v-if="creatorProfile.specializations?.length">
                    <label class="text-sm font-medium text-gray-600">Specializations</label>
                    <div class="flex flex-wrap gap-2 mt-1">
                        <span v-for="spec in creatorProfile.specializations" :key="spec"
                            class="badge badge-sm badge-green">
                            {{ spec }}
                        </span>
                    </div>
                </div>

                <div v-if="creatorProfile.socialLinks?.length">
                    <label class="text-sm font-medium text-gray-600">Social Links</label>
                    <div class="flex flex-col gap-3 mt-2">
                        <div v-for="social in creatorProfile.socialLinks" :key="social.platform"
                            class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg max-w-xs">
                            <div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                <SocialIcon :platform="social.platform" class="w-5 h-5" />
                            </div>
                            <div class="flex-1">
                                <div class="text-sm text-gray-600">{{ social.handle || social.url }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <LazyChangePassword v-if="showChangePassword" :show="showChangePassword" @close="showChangePassword = false" />
    <LazyProfileForm v-if="showChangeProfile" :show="showChangeProfile" @close="showChangeProfile = false" />
    <LazyCreatorProfileForm v-if="showEditCreatorProfile" :show="showEditCreatorProfile"
        @close="showEditCreatorProfile = false; loadCreatorProfile()" />

    <input type="file" ref="fileInput" class="hidden" accept="image/jpg, image/jpeg, image/png"
        @change="handleFileChange" />
</template>

<script lang="ts" setup>
import { LucideKey, LucidePencil } from 'lucide-vue-next';
import type { Profile } from '~/interfaces/user-interface';

onMounted(() => {
    recordVisit();
    loadCreatorProfile();
});

const AuthStore = useAuthStore();
const { user } = storeToRefs(AuthStore)

// change profile
const showChangeProfile = ref<boolean>(false);

// change password
const showChangePassword = ref<boolean>(false);

// creator profile
const showEditCreatorProfile = ref<boolean>(false);
const creatorProfile = ref<Profile | null>(null);

const loadCreatorProfile = async () => {
    try {
        creatorProfile.value = await Api.get('/v1/creator/my/profile?includes=biography,socialLinks') as Profile;
    } catch (error) {
        creatorProfile.value = null;
    }
};

// Handle file input
const fileInput = ref<HTMLInputElement | null>(null)
const handleFileChange = async (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]

    if (!file) return

    try {
        const formData = new FormData()
        formData.append('avatar', file)

        // upload to your NestJS backend
        await Api.post('/v1/auth/avatar', formData)

        AuthStore.getAuthUser();
    } catch (error) {
        toastError(error);
    } finally {
        // ✅ clear the file input so same file can be reselected
        input.value = ''
    }
}
</script>

<style></style>
