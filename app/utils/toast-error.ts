import { useToast, type ToastPosition } from "vue-toast-notification";
const toast = useToast();

export const toastError = (error: any, position: ToastPosition = "top") => {
    if (error.isJoi) {
        const error_keys = Object.keys(error.data);
        for (const key of error_keys) {
            const message = error.data[key];

            toast.error(message, {
                position,
                dismissible: true,
                duration: 5000,
            });
        }
    } else {
        const messages = Array.isArray(error.data.message) ? error.data.message : [error.data.message];
        for (const message of messages) {
            toast.error(message, {
                position,
                dismissible: true,
                duration: 5000,
            });
        }
    }
}
