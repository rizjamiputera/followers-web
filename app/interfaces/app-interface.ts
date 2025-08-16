export interface Paginate<T> {
    data: T;
    limit: number;
    total: number;
    page: number;
    last_page: number;
}
export interface PaginationParameters {
    limit: number
    page: number
    includes: string[]
}
