import { useToast, type ToastPosition } from "vue-toast-notification";
const toast = useToast();

export const toastSuccess = (message: string, position: ToastPosition = "top") => {
    toast.success(message, {
        position,
        dismissible: false,
        duration: 2000,
    });
}
