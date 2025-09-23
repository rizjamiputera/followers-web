import { useToast, type ToastPosition } from "vue-toast-notification";
const toast = useToast();

export const toastWarning = (message: string, position: ToastPosition = "top") => {
    toast.warning(message, {
        position,
        dismissible: false,
        duration: 2000,
    });
}
