<template>
    <div ref="sectionRef" class="flex flex-col gap-4">
        <div class="flex justify-between gap-2 items-center">
            <div class="main-title">Error Logs</div>
        </div>

        <div class="flex justify-between gap-4">
            <pagination :page :last_page @prev="--parameters.page" @next="++parameters.page" />

            <div class="flex-1 flex gap-3 justify-end">
                <Input v-model="search" placeholder="Cari error.." class="input-sm max-w-xs" />
            </div>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-green-main/5 bg-base-100">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th class="text-center">Status code</th>
                        <th class="text-center">Method</th>
                        <th class="text-center">Path</th>
                        <th class="text-center">Message</th>
                        <th class="text-center">Stack</th>
                        <th class="text-center">Date Time</th>
                        <th class="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isEmpty">
                        <td colspan="5" class="text-center text-green-main font-light">
                            Empty
                        </td>
                    </tr>
                    <tr v-else-if="!isLoading" v-for="(dt, n) in errorLogs" ::key="dt.id">
                        <td>{{ dt.id }}</td>
                        <td>{{ dt.user?.name }}</td>
                        <td>{{ dt.statusCode }}</td>
                        <td>{{ dt.method }}</td>
                        <td class="max-w-40 truncate">{{ dt.path }}</td>
                        <td class="max-w-60 truncate">{{ dt.message }}</td>
                        <td class="max-w-60 truncate">{{ dt.stack }}</td>
                        <td class="text-nowrap">{{ dayjs(dt.createdAt).format('DD-MM-YY HH:mm:ss') }}</td>
                        <td>
                            <Button class="btn-green" @click="selected = dt; show_detail = true;">Detail</Button>
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

    <LazyModal v-if="selected && show_detail" :show="show_detail" @close="show_detail = false" max-width="max-w-4xl">
        <div class="text-sm flex flex-col gap-4">
            <div class="flex justify-between">
                <div>User: {{ selected.user?.name }}</div>
                <div>{{ dayjs(selected.createdAt).format('DD-MM-YY HH:mm:ss') }}</div>
            </div>

            <div class="flex flex-col gap-1">
                <div class="badge badge-neutral">{{ selected.method }}</div>
                <div class="bg-neutral rounded-lg p-2 w-full text-white break-words">{{ selected.path }}</div>
            </div>

            <div>
                <div class="font-medium">Payload</div>
                <div class="mockup-code whitespace-pre-wrap">
                    <pre class="px-3">{{ selected.requestData }}</pre>
                </div>
            </div>

            <div>
                <div class="font-medium">Stack</div>
                <div class="mockup-code whitespace-pre-wrap">
                    <pre class="px-3">{{ selected.stack }}</pre>
                </div>
            </div>
        </div>
    </LazyModal>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import type { ErrorLog } from '~/interfaces/app-interface';


definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const AuthStore = useAuthStore();

            if (AuthStore.user?.role != 'SUPERADMIN') {
                return navigateTo('/cp')
            }
        }
    ]
});

const ErrorLogStore = useErrorLogStore()
const { errorLogs, page, last_page, parameters, isEmpty, isLoading, search } = storeToRefs(ErrorLogStore);
const { get } = ErrorLogStore;
onMounted(() => {
    ErrorLogStore.status = undefined;
    ErrorLogStore.parameters.page = 1;
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

const selected = ref<ErrorLog | null>(null);
const show_detail = ref<boolean>(false);

let searchTimeout: NodeJS.Timeout | null = null;
watch(() => search.value, () => {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
        // prevent double api call, because page is watch
        if (ErrorLogStore.parameters.page == 1) {
            get()
        } else {
            ErrorLogStore.parameters.page = 1;
        }
    }, 2000);
});
</script>

<style></style>
