<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script lang="ts" setup>
const { public: { webUri } } = useRuntimeConfig();
const base = (webUri || '').replace(/\/$/, '');

const settingsStore = useSiteSettingsStore();
// Fetched during SSR so the initial HTML carries real meta for crawlers.
await useAsyncData('site-settings', () => settingsStore.fetch());
const { settings } = storeToRefs(settingsStore);

const abs = (url: string) => (/^https?:\/\//.test(url) ? url : base + url);

const ogImageUrl = computed(() => abs(settings.value.og_image));
// The default share card is a known 1200x630 PNG. Uploaded images are resized
// to 1200px wide (variable height) as webp by the backend pipeline.
const ogIsDefault = computed(
    () => !settings.value.og_image || /\/og-image\.png$/i.test(settings.value.og_image),
);
const ogImageType = computed(() => {
    const u = ogImageUrl.value;
    if (/\.png$/i.test(u)) return 'image/png';
    if (/\.webp$/i.test(u)) return 'image/webp';
    if (/\.jpe?g$/i.test(u)) return 'image/jpeg';
    return undefined;
});

// Site-wide meta defaults. Individual pages override title/description/etc.
// Explicit image dimensions/type help stricter scrapers (e.g. WhatsApp Web)
// render the large preview reliably.
useSeoMeta({
    ogSiteName: () => settings.value.site_title,
    description: () => settings.value.meta_description,
    ogDescription: () => settings.value.meta_description,
    ogImage: () => ogImageUrl.value,
    ogImageSecureUrl: () => ogImageUrl.value,
    ogImageType: () => ogImageType.value,
    ogImageWidth: () => 1200,
    ogImageHeight: () => (ogIsDefault.value ? 630 : undefined),
    ogImageAlt: () => `${settings.value.site_title} — ${settings.value.tagline}`,
    twitterImage: () => ogImageUrl.value,
    twitterCard: 'summary_large_image',
});

// Organization + WebSite structured data for the whole site, driven by
// admin-editable settings (social links -> sameAs, contact -> contactPoint,
// search box -> SearchAction).
const jsonLd = computed(() => {
    const s = settings.value;
    const sameAs = [
        s.social.instagram, s.social.youtube, s.social.tiktok,
        s.social.facebook, s.social.x, s.social.whatsapp,
    ].filter(Boolean);

    const organization: Record<string, any> = {
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        name: s.site_title,
        url: base,
        logo: abs('/logo-hitam.jpg'),
        description: s.meta_description,
    };
    if (sameAs.length) organization.sameAs = sameAs;
    if (s.contact.email || s.contact.phone) {
        organization.contactPoint = {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            ...(s.contact.email ? { email: s.contact.email } : {}),
            ...(s.contact.phone ? { telephone: s.contact.phone } : {}),
        };
    }

    return JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
            organization,
            {
                '@type': 'WebSite',
                '@id': `${base}/#website`,
                name: s.site_title,
                url: base,
                inLanguage: 'id-ID',
                publisher: { '@id': `${base}/#organization` },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: `${base}/search?q={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
                },
            },
        ],
    });
});

useHead({
    script: [{ type: 'application/ld+json', innerHTML: jsonLd }],
});
</script>
