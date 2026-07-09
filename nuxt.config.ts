import tailwindcss from "@tailwindcss/vite";

const isProd = process.env.NUXT_PUBLIC_ENV === 'production';
const webUri = (process.env.NUXT_PUBLIC_WEB_URI ?? '').replace(/\/$/, '');
const sitemapUrl = `${webUri}/sitemap.xml`;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
    app: {
        head: {
            htmlAttrs: { 'data-theme': 'light', lang: 'id' },
        },
    },
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
    runtimeConfig: {
        public: {
            apiUri: "",
            webUri: "",
            env: "",
        },
    },
    modules: ['@pinia/nuxt', '@nuxtjs/robots'],

    // Non-production envs are blocked from indexing. Emits both
    // robots.txt (Disallow: /) and X-Robots-Tag: noindex, nofollow.
    robots: isProd
        ? {
              groups: [{ userAgent: ['*'], allow: ['/'] }],
              sitemap: sitemapUrl,
          }
        : {
              groups: [{ userAgent: ['*'], disallow: ['/'] }],
              metaTag: true,
              header: true,
          },
})
