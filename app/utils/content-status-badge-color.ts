import type { ContentStatus } from "~/interfaces/article-interface";

export default (status: ContentStatus) => {
    switch (status) {
        case 'DRAFT':
            return 'badge-neutral';
        case 'ON_REVIEW':
            return 'badge-accent';
        case 'REJECTED':
            return 'badge-warning';
        case 'PUBLISHED':
            return 'badge-success';
        case 'TAKE_DOWN':
            return 'badge-error';
        default:
            return '';
    }
}
