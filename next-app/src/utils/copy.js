import { successCopyToast } from "./toasts";

export default function copyToClipboard(content) {
    navigator.clipboard.writeText(content);
    successCopyToast(content);
}
