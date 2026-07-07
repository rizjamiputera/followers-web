import type { Content } from "./content-interface"

export interface User {
    id: string
    name: string
    username: string
    email: string
    active: boolean
    avatar?: string
    avatar_md?: string
    role: Role
    permissions?: UserPermission[]
    createdAt: string
}

export type Role =
    "SUPERADMIN" |
    "ADMIN" |
    "OPERATOR" |
    "USER"

export interface UserPermission {
    module: Module
    permission: Permission
}

export enum Module {
    ARTICLE = 'ARTICLE',
    EVENT = 'EVENT',
    USER = 'USER',
    COMMENT = 'COMMENT',
}

export enum Permission {
    READ = 'READ',
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    DELETE = 'DELETE',
    APPROVE = 'APPROVE', // can approve article
    PUBLISH = 'PUBLISH', // can publish or take down article

}

export interface Profile {
    id?: string
    user?: User
    userId: string
    biography?: Content
    specializations: string[]
    socialLinks: SocialLink[]
    totalArticles: number
    totalFollowers: number
    isPublic?: boolean
}


export interface SocialLink {
    platform: SocialPlatform
    url: string
    handle?: string
}

export enum SocialPlatform {
    INSTAGRAM = 'INSTAGRAM',
    FACEBOOK = 'FACEBOOK',
    TWITTER = 'TWITTER',
    YOUTUBE = 'YOUTUBE',
    TIKTOK = 'TIKTOK',
    LINKEDIN = 'LINKEDIN',
    TELEGRAM = 'TELEGRAM',
    WHATSAPP = 'WHATSAPP',
    WEBSITE = 'WEBSITE',
}
