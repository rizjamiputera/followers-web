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

        <Button class="w-full sm:btn-lg btn-green border-0 text-white mt-5" @click="register" :disabled="isLoading"
            :loading="isLoading">
            Register
        </Button>

        <Divider class="mt-15">
            <NuxtLink to="/auth/login" class="font-medium">Login</NuxtLink>
        </Divider>
    </div>
</template>

<script lang="ts" setup>
import Joi from 'joi';
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

const isRegister = Joi.object({
    name: IsString.min(3),
    email: IsEmail.min(3),
    password: IsString.min(8),
    confirm_password: IsString.min(8)
        .valid(Joi.ref('password'))
        .label('Password Confirmation')
        .options({
            messages: {
                'any.only': '{{#label}} is not match'
            }
        }),
})

const register = async () => {
    try {
        const data = Validate(isRegister, dataDto.value)

        await handleRegister(data);
    } catch (error) {
        toastError(error)
    }
}

</script>

<style></style>
