<template>
    <div class="flex flex-col gap-6 max-w-3xl">
        <div class="main-title">Site Settings</div>
        <p class="text-sm text-gray-500 -mt-4">
            Judul, deskripsi, tagline, gambar share, dan kontak yang tampil di mesin pencari & media sosial.
        </p>

        <form @submit.prevent="showConfirm = true" class="flex flex-col gap-8">
            <!-- Identitas & SEO -->
            <section class="flex flex-col gap-4 rounded-2xl border border-green-main/10 bg-base-100 p-5">
                <div class="font-semibold text-green-main">Identitas & SEO</div>

                <div>
                    <Input v-model="form.site_title" label="Nama Situs" placeholder="Followers Bicara"
                        maxlength="60" />
                    <p class="text-xs mt-1" :class="counterClass(form.site_title.length, 60)">
                        {{ form.site_title.length }}/60 karakter
                    </p>
                </div>

                <div>
                    <Input v-model="form.tagline" label="Tagline / Motto" placeholder="Berilmu sebelum berbicara"
                        maxlength="80" />
                    <p class="text-xs text-gray-400 mt-1">
                        Dipakai di judul homepage & teks brand (bukan di dalam gambar share).
                    </p>
                </div>

                <div>
                    <Textarea v-model="form.meta_description" label="Meta Description"
                        placeholder="Deskripsi singkat situs untuk hasil pencarian Google..." maxlength="200" />
                    <p class="text-xs mt-1" :class="counterClass(form.meta_description.length, 160)">
                        {{ form.meta_description.length }}/160 karakter — ideal 120–160 untuk SEO
                    </p>
                </div>
            </section>

            <!-- Gambar Share -->
            <section class="flex flex-col gap-4 rounded-2xl border border-green-main/10 bg-base-100 p-5">
                <div class="font-semibold text-green-main">Gambar Share (Open Graph)</div>
                <div class="flex items-start gap-5 max-sm:flex-col">
                    <div class="shrink-0">
                        <img :src="ogPreview" alt="OG preview"
                            class="w-64 aspect-1200/630 object-cover rounded-xl border border-green-main/20 bg-green-main/5" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <Button type="button" @click="fileInput?.click()" class="btn-sm btn-outline-green w-fit">
                            <LucideImagePlus class="h-4 w-4" /> Pilih Gambar
                        </Button>
                        <input type="file" ref="fileInput" class="hidden" accept="image/jpg, image/jpeg, image/png"
                            @change="onFileChange" />
                        <p class="text-xs text-gray-400">
                            Rasio 1200×630 (landscape). JPG/PNG. Muncul saat link dibagikan ke WhatsApp/Facebook.
                        </p>
                        <button v-if="ogFile" type="button" @click="clearFile"
                            class="text-xs text-error text-left w-fit">Batalkan gambar baru</button>
                    </div>
                </div>
            </section>

            <!-- Social -->
            <section class="flex flex-col gap-4 rounded-2xl border border-green-main/10 bg-base-100 p-5">
                <div class="font-semibold text-green-main">Media Sosial</div>
                <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                    <Input v-model="form.social.instagram" label="Instagram" placeholder="https://instagram.com/..." />
                    <Input v-model="form.social.youtube" label="YouTube" placeholder="https://youtube.com/@..." />
                    <Input v-model="form.social.tiktok" label="TikTok" placeholder="https://tiktok.com/@..." />
                    <Input v-model="form.social.facebook" label="Facebook" placeholder="https://facebook.com/..." />
                    <Input v-model="form.social.x" label="X (Twitter)" placeholder="https://x.com/..." />
                    <Input v-model="form.social.whatsapp" label="WhatsApp" placeholder="https://wa.me/62..." />
                </div>
            </section>

            <!-- Contact -->
            <section class="flex flex-col gap-4 rounded-2xl border border-green-main/10 bg-base-100 p-5">
                <div class="font-semibold text-green-main">Kontak</div>
                <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                    <Input v-model="form.contact.email" type="email" label="Email" placeholder="admin@followersbicara.com" />
                    <Input v-model="form.contact.phone" label="Telepon" placeholder="+62..." />
                </div>
            </section>

            <div class="flex justify-end gap-2">
                <Button type="button" @click="reset" class="btn-ghost" :disabled="isSaving">Reset</Button>
                <Button type="submit" class="btn-green" :disabled="isSaving">
                    <span v-if="isSaving" class="loading loading-spinner loading-xs"></span>
                    Simpan Perubahan
                </Button>
            </div>
        </form>

        <!-- Confirmation before saving (lazy: only loaded when opened) -->
        <LazyConfirmModal v-if="showConfirm" :show="showConfirm" title="Simpan perubahan site settings?"
            message="Perubahan ini langsung tampil ke publik (judul, deskripsi, tagline, gambar share, & kontak)."
            confirm-text="Ya, Simpan" :loading="isSaving" @close="showConfirm = false" @confirm="save" />
    </div>
</template>

<script lang="ts" setup>
import { LucideImagePlus } from 'lucide-vue-next';
import type { SiteSettings } from '~/interfaces/site-settings-interface';

definePageMeta({
    layout: 'control-panel',
    middleware: [
        () => {
            const AuthStore = useAuthStore();
            if (!AuthStore.isSuperOrAdmin) {
                return navigateTo('/cp');
            }
        },
    ],
});

const { public: { webUri } } = useRuntimeConfig();
const base = (webUri || '').replace(/\/$/, '');
const abs = (url: string) => (/^https?:\/\//.test(url) ? url : base + url);

const settingsStore = useSiteSettingsStore();

// Local editable copy so we don't mutate the live store until saved.
const blank = (): SiteSettings => ({
    site_title: '', meta_description: '', tagline: '', og_image: '',
    social: { instagram: '', youtube: '', tiktok: '', facebook: '', x: '', whatsapp: '' },
    contact: { email: '', phone: '' },
});
const form = ref<SiteSettings>(blank());

const hydrate = () => {
    const s = settingsStore.settings;
    form.value = {
        ...s,
        social: { ...s.social },
        contact: { ...s.contact },
    };
};

await useAsyncData('cp-site-settings', async () => {
    await settingsStore.fetch();
    return true;
});
hydrate();

const fileInput = ref<HTMLInputElement | null>(null);
const ogFile = ref<File | null>(null);
const ogLocalPreview = ref<string | null>(null);

const ogPreview = computed(() => ogLocalPreview.value ?? abs(form.value.og_image || '/og-image.png'));

const onFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    ogFile.value = file;
    ogLocalPreview.value = URL.createObjectURL(file);
};
const clearFile = () => {
    ogFile.value = null;
    ogLocalPreview.value = null;
    if (fileInput.value) fileInput.value.value = '';
};

const counterClass = (len: number, max: number) =>
    len > max ? 'text-error' : len > max * 0.9 ? 'text-warning' : 'text-gray-400';

const isSaving = ref(false);
const showConfirm = ref(false);

const save = async () => {
    try {
        isSaving.value = true;
        if (ogFile.value) {
            await settingsStore.uploadOgImage(ogFile.value);
        }
        await settingsStore.update({
            site_title: form.value.site_title.trim(),
            meta_description: form.value.meta_description.trim(),
            tagline: form.value.tagline.trim(),
            social: form.value.social,
            contact: form.value.contact,
        });
        clearFile();
        hydrate();
        showConfirm.value = false;
        toastSuccess('Site settings berhasil disimpan!');
    } catch (error) {
        toastError(error);
    } finally {
        isSaving.value = false;
    }
};

const reset = () => {
    clearFile();
    hydrate();
};
</script>
