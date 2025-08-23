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
    ARTICLE = 'ARTICLE',
    EVENT = 'EVENT',
    USER = 'USER',
    COMMENT = 'COMMENT'
}

export enum Permission {
    READ = 'READ',
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    DELETE = 'DELETE',
    APPROVE = 'APPROVE', // can approve, publish or take down article

}
