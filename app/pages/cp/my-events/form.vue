<template>
    <div class="flex flex-col gap-5">
        <!-- Sticky action bar -->
        <div
            class="sticky top-16 z-30 -mx-5 sm:-mx-10 px-5 sm:px-10 py-2.5 bg-white-main/95 backdrop-blur-sm border-b border-green-main/10">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0">
                    <div v-if="event" class="badge badge-lg rounded-full shrink-0"
                        :class="contentStatusBadgeColor(event.status)">
                        {{ event.status.replace('_', ' ') }}
                    </div>
                    <span class="font-cinzel font-bold text-green-main truncate">
                        {{ event ? 'Edit Kegiatan' : 'Kegiatan Baru' }}
                    </span>
                </div>
                <div class="flex items-center gap-1.5 flex-wrap sm:justify-end">
                    <Button class="btn-sm btn-ghost" @click="confirm_cancel = true">Cancel</Button>
                    <Button class="btn-sm btn-outline-green" @click="show_preview = true">Preview</Button>
                    <span class="w-px h-6 bg-green-main/15 mx-1 max-sm:hidden"></span>
                    <Button class="btn-sm btn-black" @click="status = 'DRAFT'; validate()">Draft</Button>
                    <Button class="btn-sm btn-black" @click="status = null; validate()">Simpan</Button>
                    <ClientOnly>
                        <Button class="btn-sm btn-green" v-if="canApprove" @click="status = 'APPROVED'; validate()">
                            Simpan &amp; Approve
                        </Button>
                        <Button class="btn-sm btn-green" v-else-if="canPublish"
                            @click="status = 'PUBLISHED'; validate()">
                            Simpan &amp; Publish
                        </Button>
                        <Button class="btn-sm btn-green" v-else @click="status = 'ON_REVIEW'; validate()">
                            Ajukan Approval
                        </Button>
                    </ClientOnly>
                </div>
            </div>
        </div>

        <!-- Title -->
        <Input v-model="dataDto.title" label="Title" placeholder="Judul kegiatan..." @keyup="checkTitleChange" />

        <!-- Slug -->
        <div>
            <div class="flex gap-1 items-center mb-1.5">
                <label class="text-sm font-medium">Slug</label>
                <div v-if="dataDto.slug != event?.slug">
                    <LucideLoader v-if="checkingSlug" :size="20" class="stroke-green-main animate-spin" />
                    <LucideCheckCircle2 v-else-if="slugAvailable" :size="20" class="stroke-green-main" />
                    <LucideXCircle v-else-if="dataDto.title != ''" :size="20" class="stroke-red-800" />
                </div>
            </div>
            <div class="flex gap-2">
                <div class="join w-full">
                    <button class="max-sm:hidden btn join-item rounded-l-full btn-active font-light">
                        {{ webUri }}/event/
                    </button>
                    <Input class="sm:join-item rounded-full sm:rounded-l-none flex-1" v-model="dataDto.slug"
                        @keyup="checkSlugChange" />
                </div>

                <!-- button link -->
                <template v-if="event ? event.status == 'PUBLISHED' : false">
                    <ButtonLink :to="`${webUri}/event/${dataDto.slug}`" target="_blank" class="btn-outline-green">Open
                    </ButtonLink>
                </template>
            </div>
            <span class="sm:hidden text-xs text-gray-500 mt-1.5 block break-all">{{ webUri }}/event/{{ dataDto.slug }}</span>
        </div>

        <!-- Ringkasan -->
        <div>
            <label class="text-sm font-medium">Ringkasan</label>
            <p class="text-xs text-gray-500 mb-1.5">
                Berisi maksimal 500 karakter punchline untuk menarik perhatian pembaca
            </p>
            <Textarea v-model="dataDto.excerpt" />
        </div>

        <!-- Konten (main) + Meta (sidebar) -->
        <div class="flex flex-col lg:flex-row gap-6 items-start">
            <!-- Detail + Konten -->
            <div class="w-full lg:flex-1 order-2 lg:order-1 min-w-0 flex flex-col gap-4">
                <!-- Detail Acara -->
                <div class="flex flex-col gap-4 rounded-2xl border border-green-main/10 p-4">
                    <div class="font-cinzel font-bold text-green-main">Detail Acara</div>
                    <Input v-model="dataDto.location" label="Lokasi" placeholder="cth: Masjid Agung..." />
                    <Textarea v-model="dataDto.address" label="Alamat" />
                    <div class="grid sm:grid-cols-2 gap-3">
                        <div>
                            <label class="text-sm font-medium mb-1 block">Mulai</label>
                            <DateTimePicker label="Start" v-model="dataDto.start_at" />
                        </div>
                        <div>
                            <label class="text-sm font-medium mb-1 block">Selesai</label>
                            <DateTimePicker label="End" v-model="dataDto.end_at" />
                        </div>
                    </div>
                </div>

                <!-- Konten -->
                <div>
                    <label class="text-sm font-medium mb-1.5 block">Konten</label>
                    <div v-if="dataDto.content?.content">
                        <TiptapEditor v-model="dataDto.content.content" />
                    </div>
                </div>
            </div>

            <!-- Images + meta -->
            <div class="w-full lg:w-80 lg:shrink-0 order-1 lg:order-2 flex flex-col gap-4">
                <!-- Image Portrait -->
                <div>
                    <div class="flex gap-2 items-start mb-1.5">
                        <div class="flex flex-col">
                            <label class="text-sm font-medium">Image Portrait</label>
                            <div class="text-xs text-gray-500">Image utama</div>
                        </div>
                        <ButtonChangePhotos @uploaded="handleNewPortraitPhoto" />
                    </div>
                    <LazyImage v-if="dataDto.image_portrait" :src="dataDto.image_portrait" alt="main image"
                        class="w-full aspect-3/4 bg-cover rounded-xl" />
                    <div v-else
                        class="w-full aspect-3/4 rounded-xl bg-green-main/10 border border-dashed border-green-main/30 flex items-center justify-center text-sm text-green-main/50">
                        Belum ada gambar
                    </div>
                </div>

                <!-- Image Landscape -->
                <div>
                    <div class="flex items-start gap-2 mb-1.5">
                        <div class="flex flex-col">
                            <label class="text-sm font-medium">Image Landscape</label>
                            <div class="text-xs text-gray-500">Untuk slide di homepage</div>
                        </div>
                        <ButtonChangePhotos @uploaded="handleNewPhoto" />
                    </div>
                    <div class="w-full aspect-video rounded-lg bg-cover bg-center overflow-hidden relative"
                        :class="{ 'bg-green-main/10 border border-dashed border-green-main/30': !dataDto.image }"
                        :style="dataDto.image ? { backgroundImage: `url(${dataDto.image})` } : {}">
                        <template v-if="dataDto.image">
                            <div class="bg-linear-to-b from-black/0 to-black/50 w-full h-full"></div>
                            <div class="absolute bottom-0 w-full p-3">
                                <div class="flex flex-col gap-px w-full text-white">
                                    <div v-if="dataDto.title" class="line-clamp-1 font-bold text-md">{{ dataDto.title }}</div>
                                    <div v-if="dataDto.excerpt" class="truncate text-sm w-full">{{ dataDto.excerpt }}</div>
                                </div>
                            </div>
                        </template>
                        <div v-else class="w-full h-full flex items-center justify-center text-sm text-green-main/50">
                            Belum ada gambar
                        </div>
                    </div>
                </div>

                <!-- Kategori -->
                <div>
                    <label class="text-sm font-medium">Kategori</label>
                    <select v-model="dataDto.categoryId"
                        class="select rounded-full bg-white-main focus:outline-green-main/40 border-green-main/20 w-full mt-1">
                        <option :value="null">-- Tanpa Kategori --</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                            {{ cat.name }}
                        </option>
                    </select>
                </div>

                <!-- Tags -->
                <TagInput v-model="eventTags" label="Tags" hint="Tambahkan tags untuk mengkategorikan event ini"
                    placeholder="Ketik untuk menambah tags..." :max-tags="10" />

                <!-- Pemateri -->
                <SpeakerInput v-model="eventSpeakers" label="Pemateri"
                    hint="Pemateri kajian pada kegiatan ini. Pilih yang sudah ada atau ketik nama untuk membuat baru."
                    placeholder="Ketik nama pemateri..." />

                <!-- Live preview (desktop) -->
                <div class="max-lg:hidden">
                    <label class="text-sm font-medium">Preview</label>
                    <div class="mt-1 flex flex-col gap-2 border border-green-main/30 rounded-xl p-3">
                        <Image v-if="dataDto.image_portrait" :src="dataDto.image_portrait"
                            class="w-full aspect-3/4 rounded-lg bg-cover bg-no-repeat" />
                        <div v-else class="w-full aspect-3/4 rounded-lg bg-green-main/20" />
                        <div class="flex flex-col gap-2 w-full min-w-0">
                            <DefaultBody v-if="dataDto.title" class="line-clamp-1 font-bold">
                                {{ dataDto.title }}
                            </DefaultBody>
                            <div v-else class="h-5 w-3/4 rounded-full bg-green-main/20"></div>
                            <EventLocationSchedule :data="(dataDto as Event)" :skipAddress="true" />
                            <DefaultBody v-if="dataDto.excerpt" class="line-clamp-3">
                                {{ dataDto.excerpt }}
                            </DefaultBody>
                            <template v-else>
                                <div class="h-3 w-full rounded-full bg-green-main/20 mt-1"></div>
                                <div class="h-3 w-full rounded-full bg-green-main/20"></div>
                                <div class="h-3 w-1/2 rounded-full bg-green-main/20"></div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Event Registration -->
        <div class="border-t border-green-main/10 pt-6">
            <div class="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h3 class="font-cinzel font-bold text-lg text-green-main">Event Registration</h3>
                <ButtonLink v-if="event?.id && registrationConfig?.isEnabled"
                    :to="`/cp/my-events/${event.id}/registrations`" class="btn btn-sm btn-outline btn-primary">
                    <LucideUsers class="h-4 w-4 mr-1" />
                    Manage Registrations
                </ButtonLink>
            </div>

            <CpEventRegistrationConfig :eventId="event?.id" :initialConfig="registrationConfig"
                :currentRegistrations="currentRegistrations" @update:config="updateRegistrationConfig" />
        </div>

        <!-- Bottom actions (so you can save without scrolling back up) -->
        <div class="flex flex-wrap items-center justify-end gap-1.5 border-t border-green-main/10 pt-4">
            <Button class="btn-sm btn-ghost" @click="confirm_cancel = true">Cancel</Button>
            <Button class="btn-sm btn-outline-green" @click="show_preview = true">Preview</Button>
            <span class="w-px h-6 bg-green-main/15 mx-1 max-sm:hidden"></span>
            <Button class="btn-sm btn-black" @click="status = 'DRAFT'; validate()">Draft</Button>
            <Button class="btn-sm btn-black" @click="status = null; validate()">Simpan</Button>
            <ClientOnly>
                <Button class="btn-sm btn-green" v-if="canApprove" @click="status = 'APPROVED'; validate()">
                    Simpan &amp; Approve
                </Button>
                <Button class="btn-sm btn-green" v-else-if="canPublish" @click="status = 'PUBLISHED'; validate()">
                    Simpan &amp; Publish
                </Button>
                <Button class="btn-sm btn-green" v-else @click="status = 'ON_REVIEW'; validate()">
                    Ajukan Approval
                </Button>
            </ClientOnly>
        </div>
    </div>

    <ConfirmModal v-if="confirm_cancel" :show="confirm_cancel" title="Batalkan perubahan?"
        message="Perubahan yang belum disimpan akan hilang." confirm-text="Ya, keluar" cancel-text="Lanjutkan edit"
        @close="confirm_cancel = false" @confirm="navigateTo('/cp/my-events')" />

    <ConfirmModal v-if="canPublish && showConfirmPublish" :show="showConfirmPublish" title="Yakin publish event ini?"
        confirm-text="Publish" max-width="max-w-lg" :loading="isSubmitting" @close="showConfirmPublish = false"
        @confirm="submit">
        <div class="text-sm mt-1 min-h-85">
            Atur Jadwal:
            <DateTimePicker v-model="publishedAt" />
        </div>
    </ConfirmModal>

    <ConfirmModal v-if="showConfirmDraftOrReview" :show="showConfirmDraftOrReview" :title="confirmSaveTitle"
        confirm-text="Simpan" confirm-class="btn-black" :loading="isSubmitting"
        @close="showConfirmDraftOrReview = false" @confirm="submit" />

    <LazyModal v-if="show_preview" :show="show_preview" @close="show_preview = false" max-width="max-w-4xl">
        <div class="p-4">
            <EventPreview :data="(dataDto as Event)" />
        </div>
    </LazyModal>
</template>

<script lang="ts" setup>
import Joi from 'joi';
import { LucideCheckCircle2, LucideLoader, LucideXCircle, LucideUsers } from 'lucide-vue-next';
import type { ContentStatus, PhotoContent } from '~/interfaces/content-interface';
import type { Event, EventDto } from '~/interfaces/event-interface';
import type { SelectedSpeaker } from '~/interfaces/speaker-interface';
import { Module, Permission } from '~/interfaces/user-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const auth = useAuthStore();
            if (!auth.can(Module.EVENT, Permission.CREATE)) {
                return navigateTo('/cp')
            }
        }
    ]
});

const AuthStore = useAuthStore();
const canApprove = computed(() => AuthStore.can(Module.EVENT, Permission.APPROVE));
const canPublish = computed(() => AuthStore.can(Module.EVENT, Permission.PUBLISH));

const CategoriesStore = useCategoriesStore();
const { categories } = storeToRefs(CategoriesStore);
onMounted(async () => { if (!CategoriesStore.loaded) await CategoriesStore.fetch(); });

const { public: { webUri } } = useRuntimeConfig();

const router = useRouter()
const route = useRoute();
let id = route.query.id as string | undefined;

const show_preview = ref<boolean>(false)

const event = ref<Event | undefined>(undefined)
const dataDto = ref<Partial<EventDto>>({
    content: {
        content: {
            content: [],
            type: 'doc'
        },
    }
});

const newPhotos = ref<PhotoContent[] | null>(null)
const eventTags = ref<string[]>([])
const eventSpeakers = ref<SelectedSpeaker[]>([])

// Registration configuration
const registrationConfig = ref<any>(null)
const currentRegistrations = ref<any[]>([])
const registrationConfigData = ref<any>(null)

const get = async () => {
    if (!id) return;

    event.value = await Api.get('/v1/event/my/' + id + '?includes=content,registrationConfig,tags.tag,speakers.speaker') as Event;

    // Load registration config if exists
    if (event.value.registrationConfig) {
        registrationConfig.value = event.value.registrationConfig
    }

    // Load current registrations if event exists and has registration config
    if (event.value.registrationConfig?.isEnabled) {
        await loadCurrentRegistrations()
    }

    // initial at edit
    slugAvailable.value = true;
}

// Registration methods
const loadCurrentRegistrations = async () => {
    if (!id) return

    try {
        const response = await Api.get(`/v1/event/${id}/registrations`) as any
        currentRegistrations.value = response.data || []
    } catch (error) {
        console.error('Failed to load registrations:', error)
    }
}

const updateRegistrationConfig = (config: any) => {
    registrationConfigData.value = config
}

const saveRegistrationConfig = async () => {
    if (!id || !registrationConfigData.value) return

    try {
        if (registrationConfig.value) {
            // Update existing config
            await Api.patch(`/v1/event/${id}/registration-config`, registrationConfigData.value)
        } else {
            // Create new config
            await Api.post(`/v1/event/${id}/registration-config`, registrationConfigData.value)
        }

        // Reload the event data to get updated config
        await get()

        // Show success message
        // You can add a toast notification here
    } catch (error: any) {
        console.error('Failed to save registration config:', error)
        // Show error message
    }
}

onMounted(get);

// Watch for event updates and sync into dataDto
watch(event, (newEvent) => {
    if (newEvent) {
        dataDto.value.title = newEvent.title
        dataDto.value.slug = newEvent.slug
        dataDto.value.excerpt = newEvent.excerpt

        dataDto.value.image = newEvent.image
        dataDto.value.image_md = newEvent.image_md
        dataDto.value.image_portrait = newEvent.image_portrait
        dataDto.value.image_portrait_md = newEvent.image_portrait_md
        dataDto.value.content = { content: newEvent.content!.content };

        dataDto.value.location = newEvent.location
        dataDto.value.address = newEvent.address
        dataDto.value.start_at = newEvent.start_at
        dataDto.value.end_at = newEvent.end_at

        dataDto.value.categoryId = newEvent.categoryId ?? null;

        // Set tags
        if (newEvent.tags) {
            eventTags.value = newEvent.tags.map(t => t.name)
        } else {
            eventTags.value = []
        }

        // Set pemateri
        eventSpeakers.value = (newEvent.speakers ?? []).map(s => ({
            speakerId: s.id,
            name: s.name,
            honorific: s.honorific,
            credentials: s.credentials,
            suffix: s.suffix,
        }));
    } else {
        // Reset tags when no event
        eventTags.value = []
        eventSpeakers.value = []
    }
}, { immediate: true })

// Watch for tag changes and update dataDto
watch(eventTags, (newTags) => {
    // Store tags as string array for API submission
    dataDto.value.tags = newTags;
}, { deep: true })



const checkTitleChange = () => {
    dataDto.value.slug = slugify(dataDto.value.title ?? '')
    checkSlug();
}
const checkSlugChange = () => {
    dataDto.value.slug = slugify(dataDto.value.slug ?? '')
    checkSlug();
}

// handle photo
const handleNewPhoto = (photos: PhotoContent[]) => {
    newPhotos.value = photos;

    dataDto.value.image = photos[0]?.path ?? '';
    dataDto.value.image_md = photos[1]?.path ?? '';
}

const handleNewPortraitPhoto = (photos: PhotoContent[]) => {
    newPhotos.value = photos;

    dataDto.value.image_portrait = photos[0]?.path ?? '';
    dataDto.value.image_portrait_md = photos[1]?.path ?? '';
}

const checkingSlug = ref<boolean>(false);
const slugAvailable = ref<boolean>(false);
let checkSlugTimeout: NodeJS.Timeout | null = null;
const checkSlug = () => {
    // if (slug.value) {
    if (dataDto.value.slug) {
        checkingSlug.value = true;
        if (checkSlugTimeout) {
            clearTimeout(checkSlugTimeout);
        }

        checkSlugTimeout = setTimeout(async () => {
            try {
                if (event.value) {
                    if (dataDto.value.slug != event.value.slug) {
                        const response = await Api.get('/v1/event/slug/check?slug=' + dataDto.value.slug);
                        slugAvailable.value = response == 'true';
                    }
                } else {
                    const response = await Api.get('/v1/event/slug/check?slug=' + dataDto.value.slug);
                    slugAvailable.value = response == 'true';

                }
            } catch (error) {
                slugAvailable.value = false;
            } finally {
                checkingSlug.value = false;
            }
        }, 2000);
    }
}

// HANDLE SUBMIT
const isEvent = Joi.object({
    title: IsString.max(255),
    slug: IsString.max(255),
    image: IsString.optional().allow(null, '').label('Image Landscape'),
    image_md: IsString.optional().allow(null, '').label('Image Landscape'),
    image_portrait: IsString.optional().allow(null, '').label('Image Portrait'),
    image_portrait_md: IsString.optional().allow(null, '').label('Image Portrait'),
    excerpt: IsString.max(500).label('Ringkasan'),
    content: IsContent,
    location: IsString.optional(),
    address: IsString.optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    speakers: Joi.array().items(Joi.object({
        speakerId: Joi.string().uuid().optional(),
        name: Joi.string().optional(),
        honorific: Joi.string().optional().allow(null, ''),
        credentials: Joi.string().optional().allow(null, ''),
        suffix: Joi.string().optional().allow(null, ''),
        role: Joi.string().optional().allow(null, ''),
    })).optional(),
    categoryId: Joi.string().uuid().optional().allow(null, ''),
    start_at: Joi.date().optional(),
    end_at: Joi.date().optional(),
})

const confirm_cancel = ref<boolean>(false);
const showConfirmPublish = ref<boolean>(false);
const showConfirmDraftOrReview = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

const validatedData = ref<Record<string, any>>({});

const status = ref<ContentStatus | null>(null);
const publishedAt = ref<string | null>(new Date().toISOString())
const confirmSaveTitle = computed(() =>
    status.value === 'ON_REVIEW'
        ? 'Yakin simpan & ajukan approval?'
        : status.value != null
            ? `Yakin simpan sebagai ${status.value.toLowerCase().replace('_', ' ')}?`
            : 'Yakin?'
);

const validate = () => {
    if (!slugAvailable.value) return;
    // reset
    showConfirmPublish.value = false;
    showConfirmDraftOrReview.value = false;

    try {
        // Map selected pemateri to the API payload (existing -> speakerId, new -> fields)
        dataDto.value.speakers = eventSpeakers.value.map(s => s.speakerId
            ? { speakerId: s.speakerId }
            : {
                name: s.name,
                honorific: s.honorific || undefined,
                credentials: s.credentials || undefined,
                suffix: s.suffix || undefined,
            });

        validatedData.value = Validate(isEvent, dataDto.value);
        validatedData.value.content = validatedData.value.content.content;
        if (validatedData.value.categoryId === '') validatedData.value.categoryId = null;

        if (status.value == "PUBLISHED") {
            if (event.value) {
                publishedAt.value = event.value.publishedAt ?? '';
            }
            // validatedData.value.status = "PUBLISHED"
            showConfirmPublish.value = true;
        } else {
            // validatedData.value.status = "DRAFT" // APPROVE
            showConfirmDraftOrReview.value = true;
        }
    } catch (error) {
        toastError(error);
    }
}

const submit = async () => {
    if (!slugAvailable.value) return;
    if (isSubmitting.value) return;

    // set loading state
    isSubmitting.value = true;

    try {
        if (id) {
            // update
            await Api.patch('/v1/event/' + id, validatedData.value);

            // 1 set as draft
            if (status.value == "DRAFT" && event.value?.status != "DRAFT") {
                await Api.post('/v1/event/draft/' + id);
            }
            // 2 set as on_review
            if (status.value == "ON_REVIEW" && event.value?.status != "ON_REVIEW") {
                await Api.post('/v1/event/review/' + id);
            }
            // 3 set as approve
            if (status.value == "APPROVED" && canApprove.value) {
                await Api.post('/v1/event/approve/' + id);
            }
            // 4 set as publish
            if (status.value == "PUBLISHED" && canPublish.value) {
                await Api.post('/v1/event/publish/' + id, { publishedAt: publishedAt.value });
            }

            // Save registration configuration if it was updated
            if (registrationConfigData.value) {
                await saveRegistrationConfig()
            }

            get()
        } else {
            // create
            const newData = await Api.post('/v1/event', validatedData.value) as Event;

            if (newData) {
                // 1 set as on_review
                if (status.value == "ON_REVIEW") {
                    await Api.post('/v1/event/review/' + newData.id);
                }
                // 2 set as approve
                if (status.value == "APPROVED" && canApprove.value) {
                    await Api.post('/v1/event/approve/' + newData.id);
                }
                // 3 set as publish
                if (status.value == "PUBLISHED" && canPublish.value) {
                    await Api.post('/v1/event/publish/' + newData.id, { publishedAt: publishedAt.value });
                }

                await router.replace({
                    path: '/cp/my-events/form',
                    query: { id: newData.id }
                })

                id = newData.id;

                // Save registration configuration if it was set
                if (registrationConfigData.value) {
                    await saveRegistrationConfig()
                }

                get();
            }
        }

        toastSuccess('Success')

        // emit('close');
    } catch (error) {
        toastError(error)
    } finally {
        isSubmitting.value = false;

        showConfirmPublish.value = false;
        showConfirmDraftOrReview.value = false;
    }
}
</script>

<style></style>
