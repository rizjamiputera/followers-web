<template>
    <div>
        <div class="flex gap-3">
            <!-- avatar -->
            <Avatar :avatar="user?.avatar_md" :name="user?.name" class="w-20 h-20" />

            <!-- profile -->
            <div class="flex flex-col gap-1">
                <div class="text-sm">{{ user?.name }}</div>
                <div class="text-sm">{{ user?.email }}</div>
                <div class="flex gap-2 items-center" v-if="role != 'SUPERADMIN'">
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
                <div v-else>
                    <div class="badget badge-sm badge-green rounded-full text-sm w-min">SUPERADMIN</div>
                </div>

            </div>
        </div>
        <hr class="my-4">
        <div v-if="user?.role == 'OPERATOR'">
            <div class="main-title mb-2">Permissions</div>

            <table class="table">
                <tbody>
                    <template v-for="module in modules">
                        <tr>
                            <th>{{ module.name }}</th>
                            <template v-for="p in module.permissions">
                                <td v-if="!(!['ARTICLE', 'EVENT'].includes(module.name) && p.name == 'APPROVE')">

                                    <input type="checkbox" class="checkbox" :checked="p.checked"
                                        @change="(e) => togglePermission(module.name, p.name, e)">
                                    {{ p.name }}
                                </td>

                            </template>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Module, Permission, type Role, type User, type UserPermission } from '~/interfaces/user-interface';

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
const userPermissions = ref<UserPermission[]>([])

const get = async () => {
    if (!id) return;

    user.value = await Api.get('/v1/user/' + id + '?includes=permissions') as User;
    role.value = user.value.role;
    userPermissions.value = user.value.permissions ?? []
}

onMounted(get);

const updateRole = async () => {
    try {
        await Api.patch('/v1/user/' + id, { role: role.value })
        get();
    } catch (error) {

    }
}

const modules = computed(() => Object.keys(Module).map((module) => {
    return {
        name: module,
        permissions: Object.keys(Permission).map((permission) => {
            console.log(module, permission)
            return {
                name: permission,
                checked: userPermissions.value.some(
                    p => p.module === module && p.permission === permission
                )
            }
        })
    }
}))

const togglePermission = async (module: string, permission: string, event: Event) => {
    const checked = (event.target as HTMLInputElement).checked

    const data = {
        userId: id,
        module,
        permission
    }

    change_permission(data, checked);
}

const change_permission = async (data: any, add: boolean) => {
    if (add) {
        await Api.post('/v1/user/add-permission', data)
    } else {
        await Api.remove('/v1/user/remove-permission', data)
    }

    get()

}
</script>

<style></style>
