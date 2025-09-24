<template>
    <div ref="sectionRef" class="flex flex-col gap-4">
        <div class="flex justify-between gap-2 items-center">
            <div class="main-title">User Management</div>
        </div>

        <div class="flex justify-between gap-4">
            <pagination :page :last_page @prev="--parameters.page" @next="++parameters.page" />

            <div class="flex-1 flex gap-3 justify-end">
                <Input v-model="search" placeholder="Cari.." class="input-sm max-w-xs" />
                <select v-model="selectedRole" @change="updateRole"
                    class="select w-40 select-sm rounded-full focus:outline-green-main/40 border-green-main/20">
                    <option value="">Semua Role</option>
                    <option value="SUPERADMIN">Superadmin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="OPERATOR">Operator</option>
                    <option value="USER">User</option>
                </select>
            </div>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-green-main/5 bg-base-100">
            <table class="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Email</th>
                        <th class="text-center">Role</th>
                        <th class="text-center">Status</th>
                        <th class="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isEmpty">
                        <td colspan="5" class="text-center text-green-main font-light">
                            Empty
                        </td>
                    </tr>
                    <tr v-else-if="!isLoading" v-for="(dt, n) in users" ::key="dt.id">
                        <td>
                            <Avatar :avatar="dt.avatar_md" :name="dt.name" class="w-12 h-12" />
                        </td>
                        <td>{{ dt.name }}</td>
                        <td>{{ dt.email }}</td>
                        <td class="text-center">{{ dt.role }}</td>
                        <td class="text-center">
                            <div class="badge" :class="dt.active ? 'badge-green' : 'badge-error'">
                                {{ dt.active ? 'Active' : 'Not Active' }}
                            </div>
                        </td>
                        <td class="text-center">
                            <div class="flex gap-1 justify-center">
                                <!-- <Button class="btn-sm" @click="get_preview(dt.id)">Preview</Button> -->
                                <ButtonLink v-if="canEdit" :to="`/cp/users/form?id=${dt.id}`"
                                    class="btn-sm btn-outline-green">
                                    Edit
                                </ButtonLink>
                            </div>
                        </td>
                    </tr>
                    <template v-else v-for="n in 10">
                        <tr>
                            <td>
                                <div class="h-6 w-6 bg-green-main/20 skeleton" />
                            </td>
                            <td>
                                <div class="h-6 w-30 bg-green-main/20 skeleton" />
                            </td>
                            <td>
                                <div class="h-6 w-20 bg-green-main/20 skeleton" />
                            </td>
                            <td>
                                <div class="h-6 w-20 bg-green-main/20 skeleton" />
                            </td>
                            <td>
                                <div class="h-6 w-20 bg-green-main/20 skeleton" />
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <pagination :page :last_page @prev="--parameters.page" @next="++parameters.page" />
    </div>
</template>

<script lang="ts" setup>
import { Module, Permission, type Role } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel'
});

const AuthStore = useAuthStore();
const canEdit = computed(() => AuthStore.can(Module.USER, Permission.EDIT));

const UsersStore = useUsersStore()
const { users, page, last_page, parameters, isEmpty, isLoading, search } = storeToRefs(UsersStore);
const { get } = UsersStore;

onMounted(() => {
    UsersStore.parameters.page = 1;
    get();
})

const sectionRef = ref<HTMLElement>();

watch(() => parameters.value.page, () => {
    get();

    if (sectionRef.value) {
        const headerOffset = 64 + 40; // pt-16 = 4rem = 64px
        const elementPosition = sectionRef.value.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
});

let searchTimeout: NodeJS.Timeout | null = null;
watch(() => search.value, () => {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
        // prevent double api call, because page is watch
        if (UsersStore.parameters.page == 1) {
            get()
        } else {
            UsersStore.parameters.page = 1;
        }
    }, 2000);
});

const selectedRole = ref<Role | ''>('')
const updateRole = (e: any) => {
    const selected = e.target.value

    UsersStore.role = selected ? selected : undefined;

    // prevent double api call, because page is watch
    if (UsersStore.parameters.page == 1) {
        get()
    } else {
        UsersStore.parameters.page = 1;
    }
}
</script>

<style></style>
