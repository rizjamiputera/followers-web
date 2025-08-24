import type { User } from "./user-interface";

export interface Content {
    id?: string
    content: {
        content: Record<string, any>
        type: string
    }
}

export type ContentStatus =
    "DRAFT" |
    "ON_REVIEW" |
    "REJECTED" |
    "PUBLISHED" |
    "TAKE_DOWN";

export const contentStatuses: ContentStatus[] = [
    "DRAFT",
    "ON_REVIEW",
    "REJECTED",
    "PUBLISHED",
    "TAKE_DOWN",
];

export interface ContentStats {
    id: string
    // lastReadAt: string
    commentCount: number
    readCount: number
    likeCount: number
    dislikeCount: number
    shareCount: number
    bookmarkCount: number
}

export interface PhotoContent {
    path: string
}

export interface Tag {
    id: string
    name: string
    slug: string
}

export interface Comment {
    id: string
    user?: User
    comment: string
    parent?: Comment
    mentioned?: User
    createdAt: string
    replies?: Comment[]
}

export enum ReactionType {
    like = "like",
    dislike = "dislike",
}
