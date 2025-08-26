import type { User } from "./user-interface";

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


export enum OrderBy {
    ASC = "asc",
    DESC = "desc",
}


export interface ErrorLog {
    id: number
    message: string
    stack?: string
    path?: string
    method?: string
    statusCode: number
    user?: User
    userId?: string
    requestData?: string
    headers?: string
    createdAt: string
}
