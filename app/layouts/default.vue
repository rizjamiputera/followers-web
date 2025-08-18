<template>
    <main data-theme="light" class="bg-white-main">
        <!-- header -->
        <Header :menuProduct @open="show_menu = true" />

        <!-- side menu -->
        <DefaultSideMenu :show="show_menu" :menuProduct @close="show_menu = false" />

        <div class="drawer">
            <div class="drawer-content min-h-screen w-screen max-w-screen overflow-hidden pt-16">
                <div class="mt-10">
                    <slot />
                </div>
                <!-- Page content here -->
            </div>
        </div>
        <DefaultFooter />
    </main>
</template>

<script lang="ts" setup>
import Header from '~/components/default/header.vue'

const show_menu = ref<boolean>(false)

const menuProduct = [
    {
        title: "Quality Inspections",
        desc: "Inspection Management for Manufacturing and Sourcing",
        url: '/quality-inspections',
        icon: resolveComponent("SvgQualityInspection")
    },
    {
        title: "Audits",
        desc: "Create custom Audit forms or use Standard Templates",
        url: '/product/audits',
        icon: resolveComponent("SvgAudits")
    },
    {
        title: "Maintenance",
        desc: "Manage your Assets and Machinery Maintenance",
        url: '/product/maintenance',
        icon: resolveComponent("SvgMaintenance")
    },
    {
        title: "Pricing",
        desc: "Options tailored for every type of business",
        url: '#',
        icon: resolveComponent("SvgPricing")
    },
]
export interface Menu {
    name: string;
    link: string;
    children?: Menu[];
}

const handleResize = () => {
    if (window.innerWidth > 1024) {
        show_menu.value = false;
    }
}

onMounted(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

</script>
