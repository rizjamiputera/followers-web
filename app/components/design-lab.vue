<template>
    <div class="design-lab">
        <div class="design-lab__title">🎨 {{ title }} <span>preview</span></div>
        <div class="design-lab__grid">
            <button v-for="(opt, i) in options" :key="opt.id" type="button"
                class="design-lab__btn" :class="{ active: modelValue === opt.id }"
                @click="select(opt.id)">
                <span class="n">{{ i + 1 }}</span>{{ opt.name }}
            </button>
        </div>
        <div v-if="hint" class="design-lab__hint">{{ hint }}</div>
    </div>
</template>

<script lang="ts" setup>
// Reusable floating "design lab" selector for live A/B previewing of layout
// variants. Pair it with a `:data-variant="value"` hook + variant CSS on the
// page being redesigned. Persists the choice per `storageKey`.
export interface DesignLabOption {
    id: number | string
    name: string
}

const props = withDefaults(defineProps<{
    modelValue: number | string
    options: DesignLabOption[]
    storageKey?: string
    title?: string
    hint?: string
}>(), {
    storageKey: '',
    title: 'Design Lab',
    hint: 'Pilihan tersimpan otomatis · sebut nomornya untuk dikunci',
});

const emit = defineEmits<{ (e: 'update:modelValue', value: number | string): void }>();

function select(id: number | string) {
    emit('update:modelValue', id);
    if (props.storageKey && import.meta.client) {
        localStorage.setItem(props.storageKey, String(id));
    }
}

// Restore the persisted choice on mount (client-only).
onMounted(() => {
    if (!props.storageKey) return;
    const raw = localStorage.getItem(props.storageKey);
    if (raw === null) return;
    // Match against option ids preserving their original type (number vs string).
    const match = props.options.find((o) => String(o.id) === raw);
    if (match) emit('update:modelValue', match.id);
});
</script>

<style scoped>
.design-lab {
    position: fixed; right: 16px; bottom: 16px; z-index: 60;
    width: 216px; padding: 12px; font-size: 12px;
    background: #fff; color: #1c1c1c;
    border: 1px solid rgba(0, 0, 0, .1); border-radius: 14px;
    box-shadow: 0 14px 36px -12px rgba(0, 0, 0, .3);
}
.design-lab__title { display: flex; align-items: center; gap: 6px; font-weight: 700; margin-bottom: 9px; }
.design-lab__title span {
    margin-left: auto; font-size: 9px; letter-spacing: .12em; text-transform: uppercase;
    color: #fff; background: #007426; padding: 2px 7px; border-radius: 999px;
}
.design-lab__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.design-lab__btn {
    display: flex; align-items: center; gap: 6px; text-align: left; cursor: pointer;
    padding: 7px 8px; font-size: 11px; color: #333;
    background: #fafafa; border: 1px solid rgba(0, 0, 0, .1); border-radius: 9px;
    transition: border-color .15s, background .15s, color .15s;
}
.design-lab__btn .n { font-weight: 800; color: #007426; }
.design-lab__btn:hover { border-color: #007426; }
.design-lab__btn.active { background: #007426; border-color: #007426; color: #fff; }
.design-lab__btn.active .n { color: #fff; }
.design-lab__hint { margin-top: 9px; font-size: 10px; line-height: 1.4; color: #888; }
</style>
