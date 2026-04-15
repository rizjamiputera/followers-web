<template>
    <Modal :show="_show" @close="close">
        <div class="p-5 flex flex-col gap-4">
            <div>
                <h3 class="text-base font-semibold">Gabungkan Tag</h3>
                <p class="text-sm text-gray-500 mt-1">
                    Konten dari <strong class="capitalize text-default">"{{ source?.name }}"</strong>
                    akan dipindahkan ke tag tujuan, lalu tag ini dihapus permanen.
                </p>
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">Gabungkan ke:</label>
                <Input v-model="search" placeholder="Cari tag..." class="input-sm input-bordered w-full" />
                <div class="mt-1 border border-border-main rounded-xl overflow-hidden bg-white">
                    <div class="max-h-44 overflow-y-auto bg-white">
                        <div v-if="filtered.length === 0"
                            class="px-4 py-3 text-sm text-gray-400 text-center">
                            Tidak ada tag
                        </div>
                        <label
                            v-for="tag in filtered"
                            :key="tag.id"
                            class="flex items-center justify-between px-3 py-2 cursor-pointer text-sm hover:bg-green-main/5 transition-colors border-b border-border-main/30 last:border-0"
                            :class="selected?.id === tag.id ? 'bg-green-main/10' : ''">
                            <div class="flex items-center gap-2">
                                <input
                                    type="radio"
                                    :value="tag"
                                    v-model="selected"
                                    class="radio radio-success radio-xs" />
                                <span class="capitalize" :class="selected?.id === tag.id ? 'text-green-main font-medium' : ''">
                                    {{ tag.name }}
                                </span>
                            </div>
                            <span class="text-xs text-gray-400">{{ tag._count?.contents ?? 0 }}</span>
                        </label>
                    </div>
                </div>
            </div>

            <div v-if="selected" class="text-xs text-warning bg-warning/10 border border-warning/30 rounded-xl px-3 py-2 flex gap-2">
                <LucideAlertTriangle class="h-3.5 w-3.5 shrink-0 mt-0.5 text-warning" />
                <span>Tag <strong>"{{ source?.name }}"</strong> akan dihapus setelah kontennya dipindahkan ke <strong>"{{ selected.name }}"</strong>.</span>
            </div>

            <div class="flex justify-end gap-2 pt-1">
                <Button type="button" @click="close" class="btn-sm btn-ghost">Batal</Button>
                <Button @click="submit" :disabled="!selected || isSubmitting" class="btn-sm btn-error">
                    <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
                    <LucideGitMerge v-else class="h-3 w-3" />
                    Gabungkan
                </Button>
            </div>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import { LucideAlertTriangle, LucideGitMerge } from 'lucide-vue-next';
import type { Tag } from '~/interfaces/content-interface';

const emit = defineEmits(['close']);
const props = defineProps<{
    source: Tag | null
    tags: Tag[]
    show: boolean
}>();

const _show = ref(false);
watchEffect(() => { _show.value = props.show; });

const search = ref('');
const selected = ref<Tag | null>(null);

watch(() => props.show, (v) => {
    if (v) { search.value = ''; selected.value = null; }
});

const filtered = computed(() =>
    props.tags.filter(t =>
        t.id !== props.source?.id &&
        t.name.toLowerCase().includes(search.value.toLowerCase())
    )
);

const TagsStore = useTagsStore();
const isSubmitting = ref(false);

const submit = async () => {
    if (!props.source || !selected.value) return;
    isSubmitting.value = true;
    try {
        await Api.post(`/v1/tags/${props.source.id}/merge-into/${selected.value.id}`);
        toastSuccess(`"${props.source.name}" digabungkan ke "${selected.value.name}"`);
        await TagsStore.get();
        close();
    } catch (error) {
        toastError(error);
    } finally {
        isSubmitting.value = false;
    }
};

const close = () => emit('close');
</script>
