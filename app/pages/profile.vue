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

        <div>
            <Button class="btn-green btn-sm" @click="showChangePassword = true">
                <LucideKey :size="16" /> Ganti Password
            </Button>
        </div>
    </section>
    <LazyChangePassword v-if="showChangePassword" :show="showChangePassword" @close="showChangePassword = false" />
</template>

<script lang="ts" setup>
import { LucideKey } from 'lucide-vue-next';


const AuthStore = useAuthStore();
const { user } = storeToRefs(AuthStore)

// change password
const showChangePassword = ref<boolean>(false);
</script>

<style></style>
