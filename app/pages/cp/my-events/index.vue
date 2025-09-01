<template>
    <div ref="sectionRef" class="flex flex-col gap-4">
        <div class="flex justify-between gap-2 items-center">
            <div class="main-title">My Events</div>
            <ButtonLink to="/cp/my-events/form" class="btn-green">
                Create New Event
            </ButtonLink>
        </div>

        <div class="flex justify-between gap-4">
            <pagination :page :last_page @prev="--parameters.page" @next="++parameters.page" />

            <div class="flex-1 flex gap-3 justify-end">
                <Input v-model="search" placeholder="Cari event.." class="input-sm max-w-xs" />
                <select v-model="selectedStatus" @change="updateStatus"
                    class="select w-40 select-sm rounded-full focus:outline-green-main/40 border-green-main/20">
                    <option value="">Semua Status</option>
                    <option v-for="value in contentStatuses" :key="value" :value>{{ value.replace('_', ' ') }}</option>
                </select>
            </div>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-green-main/5 bg-base-100">
            <table class="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th class="text-center">Start</th>
                        <th class="text-center">End</th>
                        <th class="text-center">Status</th>
                        <th class="text-center">Publish</th>
                        <th class="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isEmpty">
                        <td colspan="5" class="text-center text-green-main font-light">
                            Empty
                        </td>
                    </tr>
                    <tr v-else-if="!isLoading" v-for="(dt, n) in events" ::key="dt.id">
                        <td>
                            <div>
                                <div class="text-nowrap truncate max-w-65 md:max-w-80">{{ dt.title }}</div>
                                <div class="flex items-center gap-2">
                                    <div class="join join-horizontal">
                                        <div class="badge max-sm:badge-sm join-item font-light rounded-l-full">
                                            <LucideThumbsUp :size="14" /> {{ dt.stats?.likeCount }}
                                        </div>
                                        <div class="badge max-sm:badge-sm join-item font-light rounded-r-full">
                                            <LucideThumbsDown :size="14" /> {{ dt.stats?.dislikeCount }}
                                        </div>
                                    </div>
                                    <div class="join join-horizontal">
                                        <div class="badge max-sm:badge-sm join-item font-light rounded-l-full">
                                            <LucideEye :size="14" /> {{ dt.stats?.readCount }}
                                        </div>
                                        <div class="badge max-sm:badge-sm join-item font-light">
                                            <LucideShare2 :size="14" /> {{ dt.stats?.shareCount }}
                                        </div>
                                        <div class="badge max-sm:badge-sm join-item font-light rounded-r-full">
                                            <LucideBookmark :size="14" /> {{ dt.stats?.bookmarkCount }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="text-center text-nowrap">{{ dayjs(dt.start_at).format('DD MMM YY HH:mm') }}</td>
                        <td class="text-center text-nowrap">{{ dayjs(dt.end_at).format('DD MMM YY HH:mm') }}</td>
                        <td class="text-center">
                            <StatusBade :status="dt.status" />
                        </td>
                        <td class="text-center">
                            <div class="flex gap-1 justify-center">
                                <Button v-if="canApprove && ['ON_REVIEW', 'REJECTED', 'TAKE_DOWN'].includes(dt.status)"
                                    class="btn-sm btn-primary"
                                    @click="selectedEventId = dt.id; showConfirmApprove = true">
                                    Approve
                                </Button>

                                <Button
                                    v-if="canPublish && (['ON_REVIEW', 'APPROVED', 'REJECTED', 'TAKE_DOWN'].includes(dt.status) || (dt.status == 'PUBLISHED' && dt.publishedAt == null))"
                                    class="btn-sm btn-success"
                                    @click="selectedEventId = dt.id; showConfirmPublish = true">
                                    {{
                                        dt.status == 'PUBLISHED' && dt.publishedAt == null
                                            ? 'Atur Jadwal Publish' :
                                            'Publish'
                                    }}
                                </Button>

                                <span class="text-nowrap" v-if="dt.status == 'PUBLISHED' && dt.publishedAt != null">
                                    {{ dt.publishedAt ? formatDateTimeTz(dt.publishedAt) : '-' }}
                                </span>
                            </div>
                        </td>
                        <td class="text-center">
                            <div class="flex gap-1 justify-center">
                                <!-- preview -->
                                <Button class="btn-sm" @click="get_preview(dt.id)">Preview</Button>
                                <ButtonLink :to="`/cp/my-events/form?id=${dt.id}`" class="btn-sm"
                                    @click="get_preview(dt.id)">Edit</ButtonLink>

                                <!-- open event new tab -->
                                <ButtonLink v-if="dt.status == 'PUBLISHED'" :to="`/event/${dt.slug}`" target="_blank"
                                    class="btn-sm  btn-outline-green">
                                    <LucideLink :size="12" />
                                    Open
                                </ButtonLink>

                                <!-- take down -->
                                <Button class="btn-sm btn-error" v-if="canPublish && dt.status == 'PUBLISHED'"
                                    @click="selectedEventId = dt.id; showConfirmTakeDown = true">
                                    Take down
                                </Button>
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

    <LazyModal v-if="show_preview" :show="show_preview" @close="show_preview = false" max-width="max-w-4xl">
        <div class="p-4" v-if="selectedPreview">
            <EventPreview :data="selectedPreview" />
        </div>
    </LazyModal>

    <!-- approve -->
    <LazySetApproveModal v-if="canApprove && selectedEventId && showConfirmApprove" :show="showConfirmApprove"
        type="event" :dataId="selectedEventId" @close="showConfirmApprove = false"
        @submited="showConfirmApprove = false; get(false)" />

    <!-- publish -->
    <LazySetPublishModal v-if="canPublish && selectedEventId && showConfirmPublish" :show="showConfirmPublish"
        type="event" :dataId="selectedEventId" @close="showConfirmPublish = false"
        @submited="showConfirmPublish = false; get(false)" />

    <!-- take down -->
    <LazySetTakeDown v-if="canPublish && showConfirmTakeDown && selectedEventId" :show="showConfirmTakeDown"
        type="event" :dataId="selectedEventId" @close="showConfirmTakeDown = false"
        @submited="showConfirmTakeDown = false; get(false)" />

    <LazySetRequestReview v-if="canWrite && showConfirmRequestReview && selectedEventId"
        :show="showConfirmRequestReview" type="event" :dataId="selectedEventId"
        @close="showConfirmRequestReview = false" @submited="showConfirmRequestReview = false; get(false)" />
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { LucideBookmark, LucideEye, LucideLink, LucideShare2, LucideThumbsDown, LucideThumbsUp } from 'lucide-vue-next';
import { contentStatuses, type ContentStatus } from '~/interfaces/content-interface';
import type { Event } from '~/interfaces/event-interface';
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel'
});

const AuthStore = useAuthStore();
const canWrite = computed(() => AuthStore.can(Module.EVENT, Permission.CREATE));
const canApprove = computed(() => AuthStore.can(Module.EVENT, Permission.APPROVE));
const canPublish = computed(() => AuthStore.can(Module.EVENT, Permission.PUBLISH));

const MyEventsStore = useMyEventsStore()
const { events, page, last_page, parameters, isEmpty, isLoading, search } = storeToRefs(MyEventsStore);
const { get } = MyEventsStore;
onMounted(() => {
    MyEventsStore.status = undefined;
    MyEventsStore.parameters.page = 1;
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
        if (MyEventsStore.parameters.page == 1) {
            get()
        } else {
            MyEventsStore.parameters.page = 1;
        }
    }, 2000);
});

const selectedStatus = ref<ContentStatus | ''>('')
const updateStatus = (e: any) => {
    const selected = e.target.value

    MyEventsStore.status = selected ? selected : undefined;

    // prevent double api call, because page is watch
    if (MyEventsStore.parameters.page == 1) {
        get()
    } else {
        MyEventsStore.parameters.page = 1;
    }
}


// PREVIEW
const show_preview = ref<boolean>(false)
const selectedPreview = ref<Event | null>(null)

const get_preview = async (id: string) => {
    if (!id) return;
    selectedPreview.value = await Api.get('/v1/event/my/' + id + '?includes=content') as Event

    show_preview.value = true;

}

// SET PUBLISH
const selectedEventId = ref<string | null>(null);
const showConfirmApprove = ref<boolean>(false);
const showConfirmPublish = ref<boolean>(false);
const showConfirmTakeDown = ref<boolean>(false);
const showConfirmRequestReview = ref<boolean>(false);
</script>

<style></style>
