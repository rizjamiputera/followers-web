export interface User {
    id: string
    name: string
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
    ARTICLE = 'Article',
    EVENT = 'Event',
    USER = 'User',
    COMMENT = 'Comment'
}

export enum Permission {
    READ = 'Read',
    CREATE = 'Create',
    EDIT = 'Edit',
    DELETE = 'Delete',
    APPROVE = 'Approve', // can approve, publish or take down article

}
