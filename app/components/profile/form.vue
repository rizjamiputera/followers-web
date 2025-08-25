<template>
    <Modal :show="_show" @close="emit('close')">
        <div class="text-green-main font-medium">Ubah Profile</div>
        <form class="flex flex-col gap-2 mt-10">
            <Input type="text" v-model="dataDto.name" label="Nama" placeholder="Nama"
                class="bg-transparent sm:input-lg font-light" />
            <Input type="email" v-model="email" disabled label="Email" placeholder="Email"
                class="bg-transparent sm:input-lg font-light" />
        </form>

        <div class="modal-action">
            <Button @click="emit('close')">Batal</Button>
            <Button @click="validate" class="btn-green">Ubah</Button>
        </div>
    </Modal>

    <LazyModal v-if="show_confirm" :show="show_confirm" @close="show_confirm = false">
        Yakin ubah profile?
        <div class="modal-action">
            <Button @click="show_confirm = false" :disabled="isSubmitting">Batal</Button>

            <Button @click="submit" :disabled="isSubmitting" class="btn-green">
                <LucideLoader :size="20" v-show="isSubmitting" class="animate-spin" />
                Ubah
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

const AuthStore = useAuthStore();
const { user } = storeToRefs(AuthStore);

const email = computed(() => user?.value?.email ?? '')
const dataDto = ref({
    name: user?.value?.name ?? '',
})

const show_confirm = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

const isChangeProfile = Joi.object({
    name: IsString.min(2).label('Name'),
})
const validatedData = ref<Record<string, any>>({});

const validate = () => {
    try {
        validatedData.value = Validate(isChangeProfile, dataDto.value)
        show_confirm.value = true
    } catch (error) {
        toastError(error);
    }
}

const submit = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true
    try {
        await Api.patch('/v1/auth/profile', validatedData.value);

        AuthStore.getAuthUser()
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
