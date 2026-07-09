export interface SiteSocial {
    instagram: string
    youtube: string
    tiktok: string
    facebook: string
    x: string
    whatsapp: string
}

export interface SiteContact {
    email: string
    phone: string
}

export interface SiteSettings {
    site_title: string
    meta_description: string
    tagline: string
    og_image: string
    social: SiteSocial
    contact: SiteContact
}
