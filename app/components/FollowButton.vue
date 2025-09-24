<template>
    <Button class="btn btn-green" @click="handleFollow">
        <LucideCheck v-if="isFollowing" :size="14" />
        Follow
    </Button>
</template>

<script lang="ts" setup>
import { LucideCheck } from 'lucide-vue-next';

const emit = defineEmits(['updated'])
const props = defineProps<{
    userId: string
}>()

// Stores
const followStore = useFollowStore();
const AuthStore = useAuthStore();

const { isLogin } = storeToRefs(AuthStore);

// Computed
const isFollowing = computed(() => followStore.isFollowing(props.userId));


// Methods
const handleFollow = async () => {
    if (!isLogin.value) {
        AuthStore.show_request_login = true;
        return;
    }

    try {
        await followStore.toggleFollow(props.userId);
        emit('updated')
    } catch (error) {

    }

};

// Check follow status on mount
onMounted(() => {
    if (isLogin.value) {
        followStore.checkFollowStatus(props.userId);
    }
});

</script>

<style scoped></style>
