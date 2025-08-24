import { defineStore } from 'pinia'
import { Module, Permission, type User, type UserPermission } from '~/interfaces/user-interface'


interface LoginResponse {
    access_token: string
    exp: number
    user: User
}

interface AuthStoreState {
    access_token: string | null
    exp: number
    user?: User
    isLoading: boolean
    show_request_login: boolean
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthStoreState => ({
        access_token: null,
        exp: 0,
        user: undefined,
        isLoading: false,
        show_request_login: false,
    }),
    getters: {
        permissions: (state): UserPermission[] => state.user?.permissions ?? [],
        can: (state) => {
            return (module: Module, permission: Permission): boolean => {
                if (!state.user) return false;
                if (["SUPERADMIN", "ADMIN"].includes(state.user.role)) return true;
                if (!state.user.permissions) return false;

                const find = state.user.permissions.find(p => p.module == module && p.permission == permission)

                return find != null;
            }
        }
    },
    actions: {
        async getAuthUser() {
            try {
                this.user = await $fetch<User>('/api/auth/user', {
                    query: { includes: 'permissions' }
                })
            } catch {
                this.reset()
            }
        },
        async handleLogin(email: string, password: string) {
            if (this.isLoading) return;
            this.isLoading = true;

            try {
                const data = await Api.post('/v1/auth/login', {
                    email,
                    password
                }) as any;



                this.setAuth(data as LoginResponse);

                navigateTo('/');
            } catch (e: any) {
                toastError(e)
            } finally {
                this.isLoading = false;
            }
        },
        async handleLogout() {
            try {
                await Api.remove('/v1/auth/logout');
            } catch (error) {
            }

            this.reset()

            if (process.client) {
                const access_token = useCookie('access_token', { maxAge: new Date().getTime() - 1000 })
                // access_token.value = null;
                this.reset();
            }

            await navigateTo('/');
        },
        async handleRegister(payload: Record<string, string>) {
            if (this.isLoading) return;
            this.isLoading = true;

            try {
                const data = await Api.post('/v1/auth/register', payload) as any;

                this.setAuth(data as LoginResponse);

                navigateTo('/');
            } catch (e: any) {
                toastError(e)
            } finally {
                this.isLoading = false;
            }
        },
        setAuth(data: LoginResponse) {
            this.access_token = data.access_token;
            this.exp = data.exp;
            this.user = data.user;

            if (process.client) {
                const access_token = useCookie('access_token')
                access_token.value = data.access_token;
            }
        },
        reset() {
            this.isLoading = false;
            this.access_token = null;
            this.exp = 0;
            this.user = undefined;

            if (process.client) {
                const access_token = useCookie('access_token', { maxAge: new Date().getTime() - 1000 })
                access_token.value = null;
            }
        },
    }
})
