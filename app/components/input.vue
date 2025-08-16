<template>
    <fieldset v-if="label" class="fieldset">
        <legend class="font-medium text-sm">{{ label }}
            <span class="text-error">{{ required ? '*' : '' }}</span>
        </legend>
        <input v-bind="inputAttrs" v-model="inputValue" class="input rounded-full border-gray-300/50 w-full" :class />
        <p class="label" v-if="bottomLabel">{{ bottomLabel }}</p>
    </fieldset>
    <input v-else v-bind="inputAttrs" v-model="inputValue" class="input rounded-full border-gray-300/50 w-full"
        :class />
</template>

<script lang="ts" setup>
const props = defineProps<{
    label?: string
    bottomLabel?: string
    type?: 'text' | 'number' | 'password' | 'email'
    placeholder?: string
    modelValue?: string | number
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    class?: string;
}>();

const emit = defineEmits<{
    (event: 'update:modelValue', value: string | number): void;
}>();


const inputAttrs = computed(() => ({
    type: props.type ?? 'text',
    placeholder: props.placeholder ?? 'Type Here..',
    disabled: props.disabled,
    readonly: props.readonly,
    required: props.required,
}));

const inputValue = computed({
    get: () => props.modelValue ?? "",
    set: (value) => emit('update:modelValue', value),
});
</script>

<style></style>
