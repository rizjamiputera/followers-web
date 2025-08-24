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

        <LazyModal v-if="show_request_login" :show="show_request_login" @close="show_request_login = false">
            Anda harus login terlebih dahulu.

            <div class="modal-action">
                <Button @click="show_request_login = false">Tutup</Button>

                <!-- publish -->
                <ButtonLink to="/auth/login" @click="show_request_login = false" class="btn-green">
                    Login
                </ButtonLink>
            </div>
        </LazyModal>
    </main>
</template>

<script lang="ts" setup>
import Header from '~/components/default/header.vue'

const AuthStore = useAuthStore();
const { show_request_login } = storeToRefs(AuthStore);

const show_menu = ref<boolean>(false);
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
