<template>
    <div class="card cp-surface border border-green-main/10 shadow-sm">
        <div class="card-body p-4 sm:p-6 gap-4">
            <!-- Row 1: title + search (space-between) -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div class="main-title shrink-0">{{ title }}</div>
                <div v-if="$slots.search" class="w-full sm:w-auto sm:min-w-0">
                    <slot name="search" />
                </div>
            </div>

            <!-- Row 2: filters -->
            <div v-if="$slots.toolbar">
                <slot name="toolbar" />
            </div>

            <!-- Table -->
            <div class="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                <table class="table table-zebra">
                    <thead>
                        <tr>
                            <slot name="head" />
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="empty && !loading">
                            <td :colspan="colspan" class="text-center text-green-main font-light py-10">
                                {{ emptyText }}
                            </td>
                        </tr>
                        <template v-else-if="loading">
                            <tr v-for="n in skeletonRows" :key="`sk-${n}`">
                                <td :colspan="colspan">
                                    <div class="h-9 bg-green-main/10 rounded-lg skeleton"></div>
                                </td>
                            </tr>
                        </template>
                        <slot v-else name="rows" />
                    </tbody>
                </table>
            </div>

            <slot name="footer" />
        </div>
    </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
    title?: string
    loading?: boolean
    empty?: boolean
    colspan?: number
    emptyText?: string
    skeletonRows?: number
}>(), {
    colspan: 6,
    emptyText: 'Belum ada data',
    skeletonRows: 8,
});
</script>
