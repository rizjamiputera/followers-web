<template>
    <div class="flex gap-3">
        <!-- avatar -->
        <img v-if="user && user.avatar_md" class="w-20 h-20 rounded-full object-cover object-center bg-green-main/20"
            :src="user.avatar_md" />
        <div v-else class="w-20 h-20 rounded-full bg-green-main/20"></div>

        <!-- profile -->
        <div class="flex flex-col gap-1">
            <div class="text-sm">{{ user?.name }}</div>
            <div class="text-sm">{{ user?.email }}</div>
            <div class="flex gap-2 items-center">
                <div class="text-sm">Role</div>
                <select v-model="role" @change="updateRole"
                    class="select w-40 select-sm rounded-full focus:outline-green-main/40 border-green-main/20">
                    <option value="ADMIN"
                        v-if="['SUPERADMIN', 'ADMIN'].includes((AuthStore.user?.role ?? '') as string)">
                        Admin
                    </option>
                    <option value="OPERATOR"
                        v-if="['SUPERADMIN', 'ADMIN', 'OPERATOR'].includes((AuthStore.user?.role ?? '') as string)">
                        Operator
                    </option>
                    <option value="USER">User</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Module, Permission, type Role, type User } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: () => {
        const AuthStore = useAuthStore();
        const canEdit = computed(() => AuthStore.can(Module.USER, Permission.EDIT));

        if (!canEdit) {
            return navigateTo('/cp')
        }
    }
});

const AuthStore = useAuthStore();

const route = useRoute();
let id = route.query.id as string | undefined;

const user = ref<User | undefined>(undefined);
const role = ref<Role | null>(null)
const get = async () => {
    if (!id) return;

    user.value = await Api.get('/v1/user/' + id + '?includes=permissions') as User;
    role.value = user.value.role;
}

onMounted(get);

const updateRole = async () => {
    try {
        await Api.patch('/v1/user/' + id, { role: role.value })
        get();
    } catch (error) {

    }
}

</script>

<style></style>
