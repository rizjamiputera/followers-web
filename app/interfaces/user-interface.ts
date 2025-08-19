export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    avatar_md?: string
    role: Role
}

export type Role = "SUPERADMIN" | "ADMIN" | "OPERATOR" | "USER"
