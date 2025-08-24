<template>
    <section class="flex flex-col gap-4">
        <div class="flex gap-3">
            <Avatar :avatar="user?.avatar_md" :name="user?.name" class="w-20 h-20" />

            <div class="flex flex-col gap-1">
                <div class="text-sm">{{ user?.name }}</div>
                <div class="text-sm">{{ user?.email }}</div>
                <div>
                    <div class="badget badge-sm badge-green rounded-full text-sm w-min">{{ user?.role }}</div>
                </div>
            </div>
        </div>

        <div class="flex gap-2">
            <Button class="btn-green btn-sm" @click="fileInput?.click()">
                Ganti Foto
            </Button>
            <Button class="btn-green btn-sm" @click="showChangePassword = true">
                <LucideKey :size="16" /> Ganti Password
            </Button>
        </div>
    </section>
    <LazyChangePassword v-if="showChangePassword" :show="showChangePassword" @close="showChangePassword = false" />

    <input type="file" ref="fileInput" class="hidden" accept="image/jpg, image/jpeg, image/png"
        @change="handleFileChange" />
</template>

<script lang="ts" setup>
import { LucideKey } from 'lucide-vue-next';

onMounted(recordVisit);

const AuthStore = useAuthStore();
const { user } = storeToRefs(AuthStore)

// change password
const showChangePassword = ref<boolean>(false);

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
