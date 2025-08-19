export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    avatar_md?: string
    role: Role
    createdAt: string
}

export type Role = "SUPERADMIN" | "ADMIN" | "OPERATOR" | "USER"
