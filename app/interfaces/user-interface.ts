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
    module: string
    permission: string
}

export enum Module {
    ARTICLE,
    EVENT,
    USER,
    COMMENT
}

export enum Permission {
    READ,
    CREATE,
    EDIT,
    DELETE,
    APPROVE, // can approve, publish or take down article

}
