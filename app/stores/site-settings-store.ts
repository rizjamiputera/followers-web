import { defineStore } from 'pinia'
import type { SiteSettings } from '~/interfaces/site-settings-interface'

// Baked-in defaults. These are the source of truth until the backend
// /v1/site-settings endpoint is live, and the fallback if it ever fails —
// so the site always renders sensible SEO even with the API down.
const DEFAULTS: SiteSettings = {
    site_title: 'Followers Bicara',
    meta_description:
        'Berilmu sebelum berbicara — ruang dakwah tempat para ustadz berbagi ilmu, nasihat, dan inspirasi. Baca artikel Islami terbaru serta ikuti kajian dan kegiatan dakwah.',
    tagline: 'Berilmu sebelum berbicara',
    og_image: '/og-image.png',
    social: { instagram: '', youtube: '', tiktok: '', facebook: '', x: '', whatsapp: '' },
    contact: { email: '', phone: '' },
}

// Deep-merge a partial API response onto the defaults so a backend that
// omits a field (or nested key) never blanks the frontend.
function merge(base: SiteSettings, patch?: Partial<SiteSettings> | null): SiteSettings {
    if (!patch || typeof patch !== 'object') return { ...base }
    // For the SEO/brand fields, an empty value means "not set" -> fall back to
    // the baked-in default (empty title/description/tagline/OG is never wanted).
    return {
        site_title: patch.site_title || base.site_title,
        meta_description: patch.meta_description || base.meta_description,
        tagline: patch.tagline || base.tagline,
        og_image: patch.og_image || base.og_image,
        // Social/contact keep empty strings verbatim (clearing a link is valid).
        social: { ...base.social, ...(patch.social ?? {}) },
        contact: { ...base.contact, ...(patch.contact ?? {}) },
    }
}

interface State {
    settings: SiteSettings
    loaded: boolean
}

export const useSiteSettingsStore = defineStore('site-settings', {
    state: (): State => ({
        settings: { ...DEFAULTS, social: { ...DEFAULTS.social }, contact: { ...DEFAULTS.contact } },
        loaded: false,
    }),
    getters: {
        defaults: (): SiteSettings => DEFAULTS,
    },
    actions: {
        async fetch(force = false) {
            if (this.loaded && !force) return this.settings
            try {
                const res = (await Api.get('/v1/site-settings')) as Partial<SiteSettings> | null
                this.settings = merge(DEFAULTS, res)
            } catch (err) {
                console.error('Failed to load site settings, using defaults:', err)
                this.settings = merge(DEFAULTS, null)
            }
            this.loaded = true
            return this.settings
        },

        async update(payload: Partial<SiteSettings>) {
            const res = (await Api.put('/v1/site-settings', payload)) as Partial<SiteSettings> | null
            // Trust the server echo when present, otherwise fold the payload in.
            this.settings = merge(this.settings, res ?? payload)
            return this.settings
        },

        async uploadOgImage(file: File) {
            const fd = new FormData()
            fd.append('image', file)
            const res = (await Api.post('/v1/site-settings/og-image', fd)) as { og_image?: string } | null
            if (res?.og_image) this.settings.og_image = res.og_image
            return this.settings.og_image
        },
    },
})
