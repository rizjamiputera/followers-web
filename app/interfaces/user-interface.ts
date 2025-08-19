export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    avatar_md?: string
    role: Role
    permissions?: UserPermission[]
    createdAt: string
}

export enum Role {
    SUPERADMIN,
    ADMIN,
    OPERATOR,
    USER
}

export interface UserPermission {
    module: string
    permission: string
}

export enum Module {
    ARTICLE,
    USER,
    COMMENT
}

export enum Permission {
    READ,
    CREATE,
    EDIT,
    DELETE,
    APPROVE, // can approve article
    PUBLISH // can publish or take down article

}
