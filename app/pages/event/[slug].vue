<template>
    <section>
        <!-- CATEGORY + TAGS -->
        <div class="flex flex-wrap gap-2 items-center">
            <NuxtLink v-if="data?.category" :to="`/kategori/${data.category.slug}`" prefetch-on="interaction"
                class="badge badge-success text-white bg-green-main border-0 rounded-full">
                {{ data.category.name }}
            </NuxtLink>
            <template v-for="tag in tags" :key="tag.id">
                <div
                    class="badge badge-success badge-ghost badge-outline border-green-main/20 text-green-main capitalize rounded-full line-clamp-1 text-ellipsis">
                    {{ tag.name }}
                </div>
            </template>
        </div>
        <div v-if="isNotFound" class="text-lg text-center font-light text-green-main/80">
            Event tidak ditemukan
        </div>

        <div class="grid grid-cols-10 gap-4 md:gap-8 mt-5">
            <div class="col-span-full md:col-span-7 flex flex-col gap-4">
                <template v-if="data">
                    <!-- EVENT IMAGE -->
                    <div class="flex flex-col gap-1">
                        <Image :src="data.image_portrait" :alt="data.title"
                            class-name="aspect-3/4 bg-cover rounded-2xl" />
                        <div class="text-2xl md:text-3xl font-semibold mb-1">{{ data.title }}</div>
                        <div class="flex flex-wrap justify-center sm:justify-end gap-2">

                            <div class="flex items-center gap-2">
                                <div class="join join-horizontal">
                                    <button class="btn btn-xs sm:btn-sm join-item font-light rounded-l-full"
                                        @click="handleLike">
                                        <LucideThumbsUp :size="14"
                                            :class="{ 'fill-rose-400 stroke-rose-400': auth_reaction == 'like' }" /> {{
                                                stats?.likeCount ?? 0 }}
                                    </button>
                                    <button class="btn btn-xs sm:btn-sm join-item font-light rounded-r-full"
                                        @click="handleDislike">
                                        <LucideThumbsDown :size="14"
                                            :class="{ 'fill-rose-400 stroke-rose-400': auth_reaction == 'dislike' }" />
                                    </button>
                                </div>
                                <div class="join join-horizontal">
                                    <button @click="handleShare"
                                        class="btn btn-xs sm:btn-sm join-item font-light rounded-l-full">
                                        <LucideShare2 :size="14" /> {{ stats?.shareCount ?? 0 }}
                                    </button>
                                    <button @click="shareToWhatsApp"
                                        class="btn btn-xs sm:btn-sm join-item font-light rounded-r-full">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- location  schedule time -->
                        <EventLocationSchedule :data />
                    </div>

                    <!-- content -->
                    <div v-if="content" class="prose max-w-none">
                        <WysiwygRenderer :content />
                    </div>
                    <div v-else>
                        <div class="flex-1 flex flex-col gap-1">
                            <div class="h-5 w-3/4 bg-green-main/20 skeleton"></div>
                            <div class="h-3 w-full bg-green-main/20 skeleton mt-3"></div>
                            <div class="h-3 w-full bg-green-main/20 skeleton"></div>
                            <div class="h-3 w-1/2 bg-green-main/20 skeleton"></div>
                        </div>
                    </div>

                    <!-- Event Registration Section -->
                    <EventRegistrationInfo v-if="data" :registrationConfig="data.registrationConfig"
                        :userRegistration="data.userRegistration" :registeredCount="data.registeredCount"
                        :availableSpots="data.availableSpots" @register="showRegistrationForm" @update="showUpdateForm"
                        @cancel="showCancelDialog" />

                    <LazyContentComments v-if="contentId" :contentId :stats @add-comment="getStats" />
                </template>


            </div>
            <!-- SIDE RIGHT -->
            <div class="col-span-full md:col-span-3 flex flex-col gap-6">

                <LazyEventLatestSm :excludeSlug="data?.slug" />
                <LazyArticleLatestSm />
            </div>
        </div>

        <!-- Registration Form Modal -->
        <LazyEventRegistrationForm v-if="data?.registrationConfig" :show="showRegistrationModal"
            :registrationConfig="data.registrationConfig" :formFields="data.registrationConfig.formFields"
            :initialData="registrationFormData" :isUpdating="isUpdatingRegistration"
            :confirmationMessage="registrationStore.successMessage" @submit="handleRegistrationSubmit"
            @close="closeRegistrationModal" />

        <!-- Cancel Registration Dialog -->
        <LazyModal :show="showCancelModal" v-if="showCancelModal" @close="closeCancelModal">
            <div class="flex items-center gap-3 mb-4">
                <LucideAlertTriangle class="h-6 w-6 text-amber-500" />
                <h3 class="text-lg font-semibold text-gray-900">Batalkan Registrasi</h3>
            </div>

            <p class="text-gray-600 mb-4">
                Apakah anda yakin untuk membatalkan registrasi?
            </p>

            <div class="space-y-4">
                <div>
                    <label for="cancellation-reason" class="block text-sm font-medium text-gray-700 mb-2">
                        Alasan (optional)
                    </label>
                    <textarea id="cancellation-reason" v-model="cancellationReason" rows="3"
                        placeholder="Beritahu alasan pembatalan..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"></textarea>
                </div>

                <div class="flex gap-3">
                    <button @click="closeCancelModal"
                        class="flex-1 btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors">
                        Tetap Register
                    </button>
                    <button @click="handleCancelRegistration" :disabled="registrationStore.isSubmitting"
                        class="flex-1 btn btn-error text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <LucideLoader2 v-if="registrationStore.isSubmitting" class="h-4 w-4 mr-2 animate-spin" />
                        Ya, Batalkan
                    </button>
                </div>
            </div>
        </LazyModal>
        <!-- <div v-if="showCancelModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg max-w-md w-full p-6">
                <div class="flex items-center gap-3 mb-4">
                    <LucideAlertTriangle class="h-6 w-6 text-amber-500" />
                    <h3 class="text-lg font-semibold text-gray-900">Cancel Registration</h3>
                </div>

                <p class="text-gray-600 mb-4">
                    Are you sure you want to cancel your registration for this event?
                </p>

                <div class="space-y-4">
                    <div>
                        <label for="cancellation-reason" class="block text-sm font-medium text-gray-700 mb-2">
                            Reason for cancellation (optional)
                        </label>
                        <textarea id="cancellation-reason" v-model="cancellationReason" rows="3"
                            placeholder="Let us know why you're cancelling..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"></textarea>
                    </div>

                    <div class="flex gap-3">
                        <button @click="closeCancelModal"
                            class="flex-1 btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors">
                            Keep Registration
                        </button>
                        <button @click="handleCancelRegistration" :disabled="registrationStore.isSubmitting"
                            class="flex-1 btn btn-error text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <LucideLoader2 v-if="registrationStore.isSubmitting" class="h-4 w-4 mr-2 animate-spin" />
                            Cancel Registration
                        </button>
                    </div>
                </div>
            </div>
        </div> -->

        <!-- Success/Error Toast -->
        <div v-if="registrationStore.successMessage || registrationStore.error"
            class="fixed bottom-4 right-4 max-w-sm z-50">
            <div v-if="registrationStore.successMessage"
                class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg">
                <div class="flex items-center gap-2">
                    <LucideCheckCircle class="h-5 w-5" />
                    <span class="font-medium">{{ registrationStore.successMessage }}</span>
                </div>
            </div>

            <div v-if="registrationStore.error"
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
                <div class="flex items-center gap-2">
                    <LucideXCircle class="h-5 w-5" />
                    <span class="font-medium">{{ registrationStore.error }}</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import {
    LucideShare2, LucideThumbsDown, LucideThumbsUp, LucideX,
    LucideAlertTriangle, LucideCheckCircle, LucideXCircle, LucideLoader2
} from 'lucide-vue-next';
import { ReactionType } from '~/interfaces/content-interface';
import type { Event } from '~/interfaces/event-interface';
import { useReadEventStore } from '~/stores/read-event-store';
import { useEventRegistrationStore } from '~/stores/event-registration-store';

const route = useRoute();
const ReadEventStore = useReadEventStore();
const { data, tags, content, stats, isNotFound, auth_reaction, contentId } = storeToRefs(ReadEventStore);
const { getStats, recordVisit } = ReadEventStore;
const slug = route.params.slug as string;
ReadEventStore.slug = slug;

// Registration store
const registrationStore = useEventRegistrationStore()

// Registration modal state
const showRegistrationModal = ref(false)
const showCancelModal = ref(false)
const isUpdatingRegistration = ref(false)
const registrationFormData = ref<Record<string, any>>({})
const cancellationReason = ref('')

const { public: { apiUri, webUri } } = useRuntimeConfig();

// Single SSR + hydration fetch with all includes. Same payload powers
// the crawler, the page's SEO meta, and the in-browser reader.
const { data: eventPayload } = await useAsyncData(
    `event-${slug}`,
    async () => {
        try {
            return await $fetch<Event & { stats?: any }>(`${apiUri}/v1/event/read/${slug}`, {
                query: { includes: 'content,author,tags.tag,stats,registrationConfig,category' },
                headers: Api.headers(),
            });
        } catch (e: any) {
            if (e?.response?.status === 404 || e?.statusCode === 404) return null;
            throw e;
        }
    }
);

if (!eventPayload.value) {
    ReadEventStore.isNotFound = true;
} else {
    const { stats: _stats, ...rest } = eventPayload.value as any;
    ReadEventStore.data = rest;
    ReadEventStore.stats = _stats;
}

onMounted(() => {
    recordVisit(route.path);
})

useSeoMeta({
    title: () => data?.value?.title ?? '-',
    ogTitle: () => data?.value?.title ?? '-',
    description: () => data?.value?.excerpt ?? '-',
    ogDescription: () => data?.value?.excerpt ?? '-',
    ogImage: () => data?.value?.image_md ?? (webUri + '/logo-hitam.jpg'),
    twitterCard: 'summary_large_image',
    ogSiteName: 'FollowersBicara.com',
    ogUrl: webUri + '/event/' + slug
});

const handleShare = async () => {
    if (!data?.value) return;

    await ReadEventStore.recordShare();
    getStats();

    const shareData = {
        title: data.value.title,
        text: data.value.title,
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy link:', error);
        }
    }
};

const shareToWhatsApp = async () => {
    if (!data?.value) return;

    await ReadEventStore.recordShare();
    getStats();

    const text = encodeURIComponent(`${data.value.title} ${window.location.href}`);
    const whatsappUrl = `https://wa.me/?text=${text}`;

    window.open(whatsappUrl, '_blank');
};

const AuthStore = useAuthStore();
const handleDislike = async () => {
    if (!ReadEventStore.data) return;

    if (!AuthStore.user) {
        AuthStore.show_request_login = true;
        return;
    }

    try {
        await Api.post('/v1/event/react/' + ReadEventStore.data.id, { type: 'dislike' })
        getStats();
        ReadEventStore.data.auth_reaction = { type: ReactionType.dislike }
    } catch (error) {
    }
}

const handleLike = async () => {
    if (!ReadEventStore.data) return;

    if (!AuthStore.user) {
        AuthStore.show_request_login = true;
        return;
    }

    try {
        await Api.post('/v1/event/react/' + ReadEventStore.data.id, { type: 'like' })
        getStats();
        ReadEventStore.data.auth_reaction = { type: ReactionType.like }
    } catch (error) {
    }
}

// Registration methods
const showRegistrationForm = () => {
    const AuthStore = useAuthStore()
    if (!AuthStore.user) {
        AuthStore.show_request_login = true
        return
    }

    isUpdatingRegistration.value = false
    registrationFormData.value = {}
    showRegistrationModal.value = true
    registrationStore.clearMessages()
}

const showUpdateForm = () => {
    if (!data?.value?.userRegistration) return

    isUpdatingRegistration.value = true
    registrationFormData.value = { ...data.value.userRegistration.formData }
    showRegistrationModal.value = true
    registrationStore.clearMessages()
}

const showCancelDialog = () => {
    cancellationReason.value = ''
    showCancelModal.value = true
    registrationStore.clearMessages()
}

const closeRegistrationModal = () => {
    showRegistrationModal.value = false
    registrationFormData.value = {}
    registrationStore.clearMessages()
}

const closeCancelModal = () => {
    showCancelModal.value = false
    cancellationReason.value = ''
    registrationStore.clearMessages()
}

const handleRegistrationSubmit = async (formData: Record<string, any>) => {
    if (!data?.value?.id) return

    let success = false

    if (isUpdatingRegistration.value && data.value.userRegistration) {
        success = await registrationStore.updateRegistration(data.value.userRegistration.id, formData)
    } else {
        success = await registrationStore.register(data.value.id, formData)
    }

    if (success && data.value) {
        // Update the event data with the new registration info
        if (registrationStore.userRegistration) {
            data.value.userRegistration = registrationStore.userRegistration
        }

        // Close modal after a delay to show success message
        setTimeout(() => {
            closeRegistrationModal()
            get()
        }, 5000)

        // Refresh the page data to get updated counts
        // setTimeout(() => {
        // }, 500)
    }
}

const handleCancelRegistration = async () => {
    if (!data?.value?.userRegistration) return

    const success = await registrationStore.cancelRegistration(
        data.value.userRegistration.id,
        cancellationReason.value || undefined
    )

    if (success && data.value?.userRegistration) {
        // Update the event data
        data.value.userRegistration.status = 'CANCELLED' as any
        data.value.userRegistration.cancelledAt = new Date().toISOString()
        data.value.userRegistration.cancellationNote = cancellationReason.value || null

        closeCancelModal()

        // Refresh the page data to get updated counts
        setTimeout(() => {
            get()
        }, 500)
    }
}

// Auto-dismiss messages after 5 seconds
watch(() => registrationStore.successMessage, (message) => {
    if (message) {
        setTimeout(() => {
            registrationStore.clearMessages()
        }, 5000)
    }
})

watch(() => registrationStore.error, (error) => {
    if (error) {
        setTimeout(() => {
            registrationStore.clearMessages()
        }, 5000)
    }
})

// Initialize registration data when event data is loaded
watchEffect(() => {
    if (data?.value) {
        registrationStore.setRegistrationData({
            config: data.value.registrationConfig,
            userRegistration: data.value.userRegistration,
            registeredCount: data.value.registeredCount || 0
        })
    }
})
</script>

<style></style>
