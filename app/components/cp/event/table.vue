<template>
    <div ref="sectionRef">
        <CpContentTable :title="subtitle ? `Events ${subtitle}` : 'Events'" :loading="isLoading" :empty="isEmpty"
            :colspan="7">
            <template #search>
                <Input v-model="search" placeholder="Cari event.." class="input-sm w-full sm:w-80" />
            </template>
            <template #toolbar>
                <CpContentFilters
                    hide-search
                    v-model:status="filterStatus"
                    v-model:tag-slug="filterTagSlug"
                    v-model:category-id="filterCategoryId"
                    v-model:sort="filterSort"
                    :hide-status="!!subtitle"
                    show-sort />
            </template>

            <template #head>
                <th>Event</th>
                <th>Author</th>
                <th class="text-center">Created</th>
                <th class="text-center">Status</th>
                <th class="text-center">Registrations</th>
                <th class="text-center">Publish</th>
                <th class="text-center">Action</th>
            </template>

            <template #rows>
                <tr v-for="dt in events" :key="dt.id">
                    <td>
                        <CpContentTitleCell :image="dt.image_md || dt.image" :title="dt.title">
                            <CpContentStats :stats="dt.stats" class="mt-1" />
                        </CpContentTitleCell>
                    </td>
                    <td>
                        <div class="flex items-center gap-2">
                            <Avatar :avatar="dt.author?.avatar_md" :name="dt.author?.name" class="w-6 h-6 shrink-0" />
                            <span class="text-sm text-gray-700 text-nowrap">{{ dt.author?.name }}</span>
                        </div>
                    </td>
                    <td class="text-center text-nowrap text-sm text-gray-500">
                        {{ dayjs(dt.createdAt).format('DD-MMM-YY') }}
                    </td>
                    <td class="text-center">
                        <StatusBade :status="dt.status" />
                    </td>
                    <td class="text-center">
                        <div v-if="dt.registrationConfig?.isEnabled" class="flex items-center justify-center gap-2">
                            <div class="badge badge-sm badge-success text-nowrap">
                                {{ dt.registeredCount || 0 }}
                                <template v-if="dt.registrationConfig.participantLimit"> / {{
                                    dt.registrationConfig.participantLimit }}</template>
                            </div>
                            <ButtonLink :to="`/cp/my-events/${dt.id}/registrations`"
                                class="btn-sm btn-info btn-outline btn-square" title="Manage Registrations">
                                <LucideUsers :size="14" />
                            </ButtonLink>
                        </div>
                        <span v-else class="text-xs text-gray-400">Disabled</span>
                    </td>
                    <td class="text-center">
                        <div class="flex gap-1 justify-center">
                            <Button v-if="canApprove && dt.status == 'ON_REVIEW'" class="btn-sm btn-warning"
                                @click="selectedEventId = dt.id; showConfirmReject = true">Reject</Button>
                            <Button v-if="canApprove && ['ON_REVIEW', 'REJECTED', 'TAKE_DOWN'].includes(dt.status)"
                                class="btn-sm btn-primary"
                                @click="selectedEventId = dt.id; showConfirmApprove = true">Approve</Button>
                            <Button
                                v-if="canPublish && (['ON_REVIEW', 'APPROVED', 'REJECTED', 'TAKE_DOWN'].includes(dt.status) || (dt.status == 'PUBLISHED' && dt.publishedAt == null))"
                                class="btn-sm btn-success"
                                @click="selectedEventId = dt.id; showConfirmPublish = true">
                                {{ dt.status == 'PUBLISHED' && dt.publishedAt == null ? 'Atur Jadwal Publish' : 'Publish' }}
                            </Button>
                            <span class="text-nowrap text-sm text-gray-600"
                                v-if="dt.status == 'PUBLISHED' && dt.publishedAt != null">
                                {{ dt.publishedAt ? formatDateTimeTz(dt.publishedAt) : '-' }}
                            </span>
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="flex gap-1 justify-center">
                            <Button class="btn-sm btn-ghost btn-square" title="Preview" @click="get_preview(dt.id)">
                                <LucideEye :size="16" />
                            </Button>
                            <ButtonLink v-if="canEdit" :to="`/cp/my-events/form?id=${dt.id}`"
                                class="btn-sm btn-ghost btn-square" title="Edit">
                                <LucideSquarePen :size="16" />
                            </ButtonLink>
                            <ButtonLink v-if="dt.status == 'PUBLISHED'" :to="`/event/${dt.slug}`" target="_blank"
                                class="btn-sm btn-ghost btn-square" title="Buka">
                                <LucideExternalLink :size="16" />
                            </ButtonLink>
                            <Button class="btn-sm btn-ghost btn-square text-error"
                                v-if="canPublish && dt.status == 'PUBLISHED'" title="Take down"
                                @click="selectedEventId = dt.id; showConfirmTakeDown = true">
                                <LucideArchive :size="16" />
                            </Button>
                        </div>
                    </td>
                </tr>
            </template>

            <template #footer>
                <div class="flex justify-center">
                    <pagination :page :last_page @prev="--parameters.page" @next="++parameters.page" />
                </div>
            </template>
        </CpContentTable>
    </div>

    <LazyModal v-if="show_preview" :show="show_preview" @close="show_preview = false" max-width="max-w-4xl">
        <div class="p-4" v-if="selectedPreview">
            <EventPreview :data="selectedPreview" />
        </div>
    </LazyModal>

    <LazySetRejectModal v-if="canApprove && selectedEventId && showConfirmReject" :show="showConfirmReject" type="event"
        :dataId="selectedEventId" @close="showConfirmReject = false"
        @submited="showConfirmReject = false; get(false)" />

    <LazySetApproveModal v-if="canApprove && selectedEventId && showConfirmApprove" :show="showConfirmApprove"
        type="event" :dataId="selectedEventId" @close="showConfirmApprove = false"
        @submited="showConfirmApprove = false; get(false)" />

    <LazySetPublishModal v-if="canPublish && selectedEventId && showConfirmPublish" :show="showConfirmPublish"
        type="event" :dataId="selectedEventId" @close="showConfirmPublish = false"
        @submited="showConfirmPublish = false; get(false)" />

    <LazySetTakeDown v-if="canPublish && showConfirmTakeDown && selectedEventId" :show="showConfirmTakeDown"
        type="event" :dataId="selectedEventId" @close="showConfirmTakeDown = false"
        @submited="showConfirmTakeDown = false; get(false)" />
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { LucideEye, LucideExternalLink, LucideSquarePen, LucideArchive, LucideUsers } from 'lucide-vue-next';
import type { ContentStatus } from '~/interfaces/content-interface';
import type { Event } from '~/interfaces/event-interface';
import { Module, Permission } from '~/interfaces/user-interface';

const props = defineProps<{
    subtitle?: string
}>()

const AuthStore = useAuthStore();
const canEdit = computed(() => AuthStore.can(Module.EVENT, Permission.EDIT));
const canApprove = computed(() => AuthStore.can(Module.EVENT, Permission.APPROVE));
const canPublish = computed(() => AuthStore.can(Module.EVENT, Permission.PUBLISH));

const EventsStore = useEventsStore()
const { events, page, last_page, parameters, isEmpty, isLoading, search } = storeToRefs(EventsStore);

// const updateIncludes = () => {
//     if (!parameters.value.includes.includes('registeredCount')) {
//         parameters.value.includes.push('registeredCount');
//     }
// }
// updateIncludes();
const { get } = EventsStore;

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
        if (EventsStore.parameters.page == 1) {
            get()
        } else {
            EventsStore.parameters.page = 1;
        }
    }, 2000);
});

const refetch = () => {
    if (EventsStore.parameters.page == 1) get()
    else EventsStore.parameters.page = 1;
}

const filterStatus = computed({
    get: () => (EventsStore.status ?? '') as ContentStatus | '',
    set: (v) => { EventsStore.status = v || undefined; refetch(); }
});
const filterTagSlug = computed({
    get: () => EventsStore.tagSlug ?? '',
    set: (v) => { EventsStore.tagSlug = v || undefined; refetch(); }
});
const filterCategoryId = computed({
    get: () => EventsStore.categoryId ?? '',
    set: (v) => { EventsStore.categoryId = v || undefined; refetch(); }
});
const filterSort = computed({
    get: () => EventsStore.sort,
    set: (v) => { EventsStore.sort = v || 'newest'; refetch(); }
});


// PREVIEW
const show_preview = ref<boolean>(false)
const selectedPreview = ref<Event | null>(null)

const get_preview = async (id: string) => {
    if (!id) return;
    selectedPreview.value = await Api.get('/v1/event/admin/' + id + '?includes=content') as Event

    show_preview.value = true;

}

// SET
const selectedEventId = ref<string | null>(null);
const showConfirmReject = ref<boolean>(false);
const showConfirmApprove = ref<boolean>(false);
const showConfirmPublish = ref<boolean>(false);
const showConfirmTakeDown = ref<boolean>(false);
</script>

<style></style>
