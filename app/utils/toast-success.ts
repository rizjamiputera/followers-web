import { useToast } from "vue-toast-notification";
const toast = useToast();

export const toastSuccess = (message: string) => {
    toast.success(message, {
        position: "top-right",
        dismissible: false,
        duration: 2000,
    });
}
