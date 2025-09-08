<template>
    <div>
        <div>
            <p class="text-4xl mt-4">Login</p>
            <p class="text-lg font-extralight mt-4">Login to your account</p>
        </div>

        <!-- <Button class="w-full btn-lg bg-custom2 border-custom1 text-white font-light mt-5">
            <IconsGoogle class="w-5" />
            Sign in with Google
        </Button> -->

        <form class="flex flex-col gap-2 mt-10">
            <Input type="text" v-model="dataDto.email" label="Email" placeholder="Email"
                class="bg-transparent sm:input-lg font-light" />
            <Input type="password" v-model="dataDto.password"
                @keyup.prevent.enter="handleLogin(dataDto.email, dataDto.password, redirectPath)" label="Password"
                placeholder="Password" class="bg-transparent sm:input-lg font-light" />
        </form>

        <Button class="w-full sm:btn-lg btn-green border-0 text-white mt-5"
            @click="handleLogin(dataDto.email, dataDto.password, redirectPath)" :disabled="isLoading" :loading="isLoading">
            Login
        </Button>

        <Divider class="mt-15">
            <NuxtLink :to="redirectPath ? `/auth/register?redirect=${encodeURIComponent(redirectPath)}` : '/auth/register'" class="font-medium">Register</NuxtLink>
        </Divider>
    </div>
</template>

<script lang="ts" setup>
import Input from '~/components/input.vue';
definePageMeta({
    layout: 'auth'
});

onMounted(recordVisit);

// SEO and META
const { public: { webUri } } = useRuntimeConfig();
const title = 'Followers Bicara';
const description = "Ruang dakwah, tempat para ustadz berbagi ilmu, nasihat, dan inspirasi.";

useSeoMeta({
    title: () => title,
    ogTitle: () => title,
    description: () => description,
    ogDescription: () => description,
    ogImage: () => webUri + '/logo-hitam.jpg',
    twitterCard: 'summary_large_image',
    ogSiteName: 'FollowersBicara.com',
    ogUrl: webUri
});

const dataDto = ref({
    email: '',
    password: ''
})

const AuthStore = useAuthStore();
const { handleLogin } = AuthStore;
const { isLoading } = storeToRefs(AuthStore);

const route = useRoute();
const redirectPath = route.query.redirect as string;
</script>

<style></style>
