<template>
    <Modal :show="_show" max-width="max-w-2xl" @close="close">
        <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">
                {{ data ? 'Edit Pemateri' : 'Tambah Pemateri' }}
            </h3>

            <form @submit.prevent="submitForm" class="space-y-4">
                <!-- Avatar -->
                <div class="flex items-center gap-4">
                    <div class="relative shrink-0">
                        <img v-if="avatarPreview" :src="avatarPreview"
                            class="w-20 h-20 rounded-full object-cover border border-green-main/20" />
                        <div v-else
                            class="w-20 h-20 rounded-full bg-green-main/10 flex items-center justify-center text-2xl font-bold text-green-main border border-green-main/20">
                            {{ (formData.name || '?').charAt(0).toUpperCase() }}
                        </div>
                    </div>
                    <div>
                        <Button type="button" @click="fileInput?.click()" class="btn-sm btn-outline-green">
                            <LucideImagePlus class="h-4 w-4" /> Pilih Foto
                        </Button>
                        <input type="file" ref="fileInput" class="hidden" accept="image/jpg, image/jpeg, image/png"
                            @change="onFileChange" />
                        <p class="text-xs text-gray-400 mt-1">JPG/PNG, maks 10MB (opsional)</p>
                    </div>
                </div>

                <div>
                    <label class="label"><span class="label-text">Nama *</span></label>
                    <Input v-model="formData.name" placeholder="cth: Fadhil Amir" class="input-bordered w-full" required
                        maxlength="150" />
                    <p class="text-xs text-gray-400 mt-1">Tanpa gelar — gelar diisi di kolom terpisah.</p>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="label"><span class="label-text">Gelar depan</span></label>
                        <Input v-model="formData.honorific" placeholder="cth: Ustadz, Dr." class="input-bordered w-full"
                            maxlength="50" />
                        <div class="flex flex-wrap gap-1.5 mt-2">
                            <button v-for="opt in honorificOptions" :key="opt" type="button"
                                @click="toggleField('honorific', opt)"
                                class="badge badge-sm cursor-pointer hover:opacity-80"
                                :class="formData.honorific === opt ? 'badge-success' : 'badge-ghost'">
                                {{ opt }}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label class="label"><span class="label-text">Gelar akademik</span></label>
                        <Input v-model="formData.credentials" placeholder="cth: B.A., M.Pd."
                            class="input-bordered w-full" maxlength="100" />
                        <div class="flex flex-wrap gap-1.5 mt-2">
                            <button v-for="opt in credentialOptions" :key="opt" type="button"
                                @click="toggleCredential(opt)"
                                class="badge badge-sm cursor-pointer hover:opacity-80"
                                :class="hasCredential(opt) ? 'badge-success' : 'badge-ghost'">
                                {{ opt }}
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="label"><span class="label-text">Doa / suffix</span></label>
                    <Input v-model="formData.suffix" placeholder="cth: حفظه الله" class="input-bordered w-full"
                        maxlength="50" dir="rtl" />
                    <div class="flex flex-wrap gap-1.5 mt-2">
                        <button v-for="opt in suffixOptions" :key="opt.value" type="button"
                            @click="toggleField('suffix', opt.value)"
                            class="badge badge-sm cursor-pointer hover:opacity-80 gap-1"
                            :class="formData.suffix === opt.value ? 'badge-success' : 'badge-ghost'"
                            :title="opt.label">
                            <span dir="rtl">{{ opt.value }}</span>
                            <span class="opacity-60 text-[10px]">{{ opt.label }}</span>
                        </button>
                    </div>
                </div>

                <div>
                    <label class="label"><span class="label-text">Bio</span></label>
                    <Textarea v-model="formData.bio" placeholder="Biografi singkat (opsional)..." />
                </div>

                <div class="flex justify-end gap-2 pt-4">
                    <Button type="button" @click="close" class="btn-ghost">Batal</Button>
                    <Button type="submit" class="btn-green" :disabled="isSubmitting || !formData.name.trim()">
                        <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
                        {{ data ? 'Simpan' : 'Buat Pemateri' }}
                    </Button>
                </div>
            </form>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import { LucideImagePlus } from 'lucide-vue-next';
import type { Speaker } from '~/interfaces/speaker-interface';

const emit = defineEmits(['close', 'saved']);
const props = defineProps<{
    data: Speaker | null
    show: boolean
}>();

const _show = ref(false);
const formData = ref({
    name: '',
    honorific: '',
    credentials: '',
    suffix: '',
    bio: '',
});

// Quick-fill options
const honorificOptions = ['Ustadz', 'Ustadzah', 'Syaikh', 'Habib', 'Dr.', 'Prof.', 'KH.', 'Buya'];
const credentialOptions = ['Lc.', 'B.A.', 'M.A.', 'M.Pd.', 'M.Ag.', 'M.H.I.', 'S.Ag.', 'Ph.D.'];

// Credentials stack (e.g. "Lc., M.A."), so chips append/remove instead of replace.
const parseCreds = () => formData.value.credentials.split(',').map(s => s.trim()).filter(Boolean);
const hasCredential = (val: string) => parseCreds().includes(val);
const toggleCredential = (val: string) => {
    const parts = parseCreds();
    const idx = parts.indexOf(val);
    if (idx >= 0) parts.splice(idx, 1);
    else parts.push(val);
    formData.value.credentials = parts.join(', ');
};
const suffixOptions = [
    { value: 'حفظه الله', label: 'hafizhahullah (♂ hidup)' },
    { value: 'حفظها الله', label: 'hafizhahallah (♀ hidup)' },
    { value: 'رحمه الله', label: 'rahimahullah (♂ wafat)' },
    { value: 'رحمها الله', label: 'rahimahallah (♀ wafat)' },
    { value: 'رضي الله عنه', label: 'radhiyallahu ‘anhu' },
];

// Click a chip to fill; click the active one again to clear.
const toggleField = (field: 'honorific' | 'suffix', value: string) => {
    formData.value[field] = formData.value[field] === value ? '' : value;
};

const fileInput = ref<HTMLInputElement | null>(null);
const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);

watchEffect(() => {
    _show.value = props.show;
    formData.value.name = props.data?.name ?? '';
    formData.value.honorific = props.data?.honorific ?? '';
    formData.value.credentials = props.data?.credentials ?? '';
    formData.value.suffix = props.data?.suffix ?? '';
    formData.value.bio = props.data?.bio ?? '';
    avatarFile.value = null;
    avatarPreview.value = props.data?.avatar_md ?? null;
});

const onFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    avatarFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
};

const isSubmitting = ref(false);

const submitForm = async () => {
    try {
        isSubmitting.value = true;
        const payload = {
            name: formData.value.name.trim(),
            honorific: formData.value.honorific.trim() || undefined,
            credentials: formData.value.credentials.trim() || undefined,
            suffix: formData.value.suffix.trim() || undefined,
            bio: formData.value.bio.trim() || undefined,
        };

        let speakerId = props.data?.id;
        if (props.data) {
            await Api.patch('/v1/speakers/' + props.data.id, payload);
        } else {
            const created = await Api.post('/v1/speakers', payload) as Speaker;
            speakerId = created?.id;
        }

        // Upload avatar after the speaker exists
        if (avatarFile.value && speakerId) {
            const fd = new FormData();
            fd.append('avatar', avatarFile.value);
            await Api.post('/v1/speakers/' + speakerId + '/avatar', fd);
        }

        toastSuccess(props.data ? 'Pemateri berhasil diperbarui!' : 'Pemateri berhasil dibuat!');
        emit('saved');
        close();
    } catch (error) {
        toastError(error);
    } finally {
        isSubmitting.value = false;
    }
};

const close = () => {
    emit('close');
};
</script>
