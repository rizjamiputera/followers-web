<template>
    <div>
        <div>
            <p class="text-4xl mt-4">Register</p>
        </div>

        <!-- <Button class="w-full btn-lg bg-custom2 border-custom1 text-white font-light mt-5">
            <IconsGoogle class="w-5" />
            Sign in with Google
        </Button> -->

        <form class="flex flex-col gap-2 mt-10">
            <Input type="text" v-model="dataDto.name" label="Name" placeholder="Name"
                class="bg-transparent sm:input-lg font-light" />
            <Input type="text" v-model="dataDto.email" label="Email" placeholder="Email"
                class="bg-transparent sm:input-lg font-light" />
            <Input type="password" v-model="dataDto.password" @keyup.prevent.enter="showConfirm = true" label="Password"
                placeholder="Password" class="bg-transparent sm:input-lg font-light" />
            <Input type="password" v-model="dataDto.confirm_password" @keyup.prevent.enter="showConfirm = true"
                label="Confirm Password" placeholder="Confirm Password" class="bg-transparent sm:input-lg font-light" />
        </form>

        <Button class="w-full sm:btn-lg btn-green border-0 text-white mt-5" @click="handleRegister(dataDto)"
            :disabled="isLoading" :loading="isLoading">
            Register
        </Button>

        <Divider class="mt-15">
            <NuxtLink to="/auth/login" class="font-medium">Login</NuxtLink>
        </Divider>
    </div>
</template>

<script lang="ts" setup>
import Input from '~/components/input.vue';



definePageMeta({
    layout: 'auth'
})

const dataDto = ref({
    name: '',
    email: '',
    password: '',
    confirm_password: ''
})

const AuthStore = useAuthStore();
const { handleRegister } = AuthStore;
const { isLoading } = storeToRefs(AuthStore);

const showConfirm = ref<boolean>(false);

</script>

<style></style>
