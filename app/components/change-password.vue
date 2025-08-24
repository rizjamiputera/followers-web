<template>
    <Modal :show="_show" @close="emit('close')">
        <div class="text-green-main font-medium">Ganti Password</div>
        <form class="flex flex-col gap-2 mt-10">
            <Input type="password" v-model="dataDto.old_password" label="Password Lama" placeholder="Password Lama"
                class="bg-transparent sm:input-lg font-light" />
            <Input type="password" v-model="dataDto.password" label="Password Baru" placeholder="Password Baru"
                class="bg-transparent sm:input-lg font-light" />
            <Input type="password" v-model="dataDto.confirm_password" label="Konfirmasi Password"
                placeholder="Konfirmasi Password" class="bg-transparent sm:input-lg font-light" />
        </form>

        <div class="modal-action">
            <Button @click="emit('close')">Batal</Button>
            <Button @click="validate" class="btn-green">Ganti Password</Button>
        </div>
    </Modal>

    <LazyModal v-if="show_confirm" :show="show_confirm" @close="show_confirm = false">
        Yakin ganti password?
        <div class="modal-action">
            <Button @click="show_confirm = false" :disabled="isSubmitting">Batal</Button>

            <Button @click="submit" :disabled="isSubmitting" class="btn-green">
                <LucideLoader :size="20" v-show="isSubmitting" class="animate-spin" />
                Ganti
            </Button>
        </div>
    </LazyModal>
</template>

<script lang="ts" setup>
import Joi from 'joi';
import { LucideLoader } from 'lucide-vue-next';

const emit = defineEmits(['close']);
const props = defineProps<{
    show: boolean
}>()

const _show = ref<boolean>(false);

watchEffect(() => {
    _show.value = props.show;
})

const dataDto = ref({
    old_password: "",
    password: "",
    confirm_password: ""
})

const show_confirm = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

const isChangePassword = Joi.object({
    old_password: IsString.label('Old Password'),
    password: IsString.min(8).label('New Password'),
    confirm_password: IsString.min(8)
        .valid(Joi.ref('password'))
        .label('Konfirmasi Password')
        .options({
            messages: {
                'any.only': '{{#label}} tidak sama'
            }
        }),
})
const validatedData = ref<Record<string, any>>({});

const validate = () => {
    try {
        validatedData.value = Validate(isChangePassword, dataDto.value)
        show_confirm.value = true
    } catch (error) {
        toastError(error);
    }

}

const submit = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true
    try {
        await Api.patch('/v1/auth/change_password', validatedData.value);

        emit('close');
    } catch (error) {
        toastError(error);
    } finally {
        isSubmitting.value = false;
        show_confirm.value = false;
    }
}
</script>

<style></style>
