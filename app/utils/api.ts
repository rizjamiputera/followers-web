export interface ApiInterface {
    check_maintenance: () => void
    headers: () => Record<string, any>
    get: (path: string) => Promise<unknown>;
    get_blob: (path: string) => Promise<unknown>;
    getBlob: (path: string) => Promise<ArrayBuffer>;
    post: (path: string, data?: Record<string, any> | FormData) => Promise<unknown>;
    postWithXVar: (path: string, data?: Record<string, any> | FormData) => Promise<unknown>;
    put: (path: string, data: Record<string, any> | FormData) => Promise<unknown>;
    patch: (path: string, data?: Record<string, any> | FormData) => Promise<unknown>;
    upload_file: (path: string, file: File, data?: Record<string, any>) => Promise<unknown>;
    upload_file_stream: (path: string, file: File, content_type: string) => Promise<unknown>;
    remove: (path: string, body?: Record<string, any>) => Promise<unknown>;
    handleError: (error: any) => void;
}

export const Api: ApiInterface = {
    check_maintenance: () => {
        const under_maintenance = useCookie('under_maintenance')
        if (under_maintenance.value == '1') {
            throw new Error('Under Maintenance')
        }
        return true
    },
    headers: () => {
        let access_token = useCookie('access_token');

        if (!access_token.value) {
            // const AuthStore = useAuthStore();
            // if (AuthStore.access_token) {
            //     access_token.value = AuthStore.access_token;
            // }
        }

        const headers: Record<string, any> = {};
        if (access_token.value) {
            headers["Authorization"] = `Bearer ${access_token.value}`;
        }
        return headers;
    },
    get: async (path: string) => {
        Api.check_maintenance();

        const apiUri = useRuntimeConfig().public.apiUri;
        try {
            const data = await $fetch(apiUri + path, {
                method: 'GET',
                headers: Api.headers()
            });

            // RETURN DATA
            return data
        } catch (error) {
            Api.handleError(error);
        }
    },
    get_blob: async (path: string) => {
        Api.check_maintenance();

        const apiUri = useRuntimeConfig().public.apiUri;
        const pageUri = useRuntimeConfig().public.pageUri;
        try {
            const response = await $fetch(apiUri + path, {
                method: 'GET',
                headers: Api.headers(),
                responseType: 'blob'
            });

            const imageUrl = URL.createObjectURL(response as Blob);

            // TODO node data di ganti berdasarkan api url, perbaiki jika di live terjadi error
            return imageUrl.replace('nodedata:', pageUri + '/');

        } catch (error) {
            Api.handleError(error);
        }
    },
    getBlob: async (path: string) => {
        Api.check_maintenance();

        const apiUri = useRuntimeConfig().public.apiUri;
        try {
            const response = await $fetch(apiUri + path, {
                method: 'GET',
                headers: Api.headers(),
                responseType: 'arrayBuffer'
            });

            return response as ArrayBuffer;

        } catch (error) {
            Api.handleError(error);
            throw error;
        }
    },
    post: async (path: string, data?: Record<string, any> | FormData) => {
        Api.check_maintenance();

        const apiUri = useRuntimeConfig().public.apiUri;

        let body;
        if (data) {
            body = !(data instanceof FormData)
                ? JSON.stringify(data)
                : data
        }

        try {
            let params: any = {
                method: 'POST',
                headers: Api.headers()
            };

            if (data) {
                params.body = body;
            }

            const response = await $fetch(apiUri + path, params);

            // RETURN DATA
            return response
        } catch (error) {
            Api.handleError(error);
        }
    },
    postWithXVar: async (path: string, data?: Record<string, any> | FormData) => {
        Api.check_maintenance();

        const apiUri = useRuntimeConfig().public.apiUri;

        let body;
        if (data) {
            body = !(data instanceof FormData)
                ? JSON.stringify(data)
                : data
        }

        try {
            let params: any = {
                method: 'POST',
                headers: {
                    ...Api.headers(),
                    'Content-Type': 'application/json',
                },
            };

            if (data) {
                params.body = body;
            }

            const response = await fetch(apiUri + path, params) as any;

            let response_data;
            // GET RESPONSE DATA
            if (response.headers.get('Content-Type') === 'application/json') {
                response_data = await response.json();
            } else if (response.headers.get('Content-Type') === 'image/png') {
                response_data = await response.blob();
            } else {
                response_data = response;
            }

            // GET DATA FROM X-VAR
            const xvar = await response.headers.get('X-var');

            // RETURN DATA
            return {
                data: response_data,
                xvar: JSON.parse(xvar)
            }
        } catch (error) {
            Api.handleError(error);
        }
    },
    put: async (path: string, data: Record<string, any> | FormData) => {
        Api.check_maintenance();

        const apiUri = useRuntimeConfig().public.apiUri;
        const body = !(data instanceof FormData)
            ? JSON.stringify(data)
            : data

        try {
            const response = await $fetch(apiUri + path, {
                method: 'PUT',
                body,
                headers: Api.headers()
            });

            // RETURN DATA
            return response
        } catch (error) {
            Api.handleError(error);
        }
    },
    patch: async (path: string, data?: Record<string, any> | FormData) => {
        Api.check_maintenance();

        const apiUri = useRuntimeConfig().public.apiUri;
        const body = !(data instanceof FormData)
            ? JSON.stringify(data)
            : data

        try {
            const response = await $fetch(apiUri + path, {
                method: 'PATCH',
                body,
                headers: Api.headers()
            });

            // RETURN DATA
            return response
        } catch (error) {
            Api.handleError(error);
        }
    },
    remove: async (path: string, body?: Record<string, any>) => {
        Api.check_maintenance();

        const apiUri = useRuntimeConfig().public.apiUri;
        try {
            const data = await $fetch(apiUri + path, {
                method: 'DELETE',
                headers: Api.headers(),
                ...(body && { body })
            });

            // RETURN DATA
            return data
        } catch (error) {
            Api.handleError(error);
        }
    },
    upload_file: async (path: string, file: File, data?: Record<string, any>) => {
        Api.check_maintenance();

        const apiUri = useRuntimeConfig().public.apiUri;

        let headers = Api.headers();

        if (data) {
            // const xvar = { id };
            headers = {
                ...Api.headers(),
                'X-Var': JSON.stringify(data)
            }
        }
        try {
            await $fetch(apiUri + path, {
                method: 'POST',
                body: file,
                headers
            });
        } catch (error) {
        }
    },
    upload_file_stream: async (path: string, file: File, content_type: string) => {
        Api.check_maintenance();

        const apiUri = useRuntimeConfig().public.apiUri;

        let headers = {
            ...Api.headers(),
            'Content-Type': content_type
        };

        try {
            const response = await $fetch(apiUri + path, {
                method: 'POST',
                body: file,
                headers
            });
            return response;
        } catch (error) {
            Api.handleError(error);
        }
    },
    handleError: (error: any) => {
        const route = useRoute();

        // UNAUTHORIZED
        if (error.status == 401) {
            const { path } = useRoute();
            if (path.startsWith('/cp')) {
                navigateTo('/auth/login');
                return;
            }
        }
        if (error.status == undefined || error.status == 500) {
            // toastError(new Error('Terjadi kesalahan pada server'));
        }

        if (error.status == 400 || error.status == 422) {
            // const detail = error.data.message;
            // if (typeof detail === 'string') {
            //     toastError(new Error(detail));
            //     return;
            // }

            // if (typeof detail === 'object' && !Array.isArray(detail)) {
            //     for (const key of Object.keys(detail)) {
            //         console.log(key)
            //         if (Array.isArray(detail[key])) {
            //             for (const error_message of detail[key]) {
            //                 toastError(new Error(error_message));
            //             }
            //         } else {
            //             toastError(new Error(detail[key]));
            //         }
            //     }
            // } else {
            //     toastError(new Error(detail));
            // }
            toastError(error)
        }

        throw error;
    }
};
