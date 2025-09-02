<template>
    <div data-theme="light" class="footer-wrapper">
        <footer>
            <div class="footer-brand">
                <!-- <img src="/logo-hitam.webp" alt="Followers Logo" class="h-15"> -->
                <img src="/logo.svg" alt="Followers Logo" class="h-15">
                <p>كُلُّ نَفْسٍ ذَاۤىِٕقَةُ الْمَوْتِۗ</p>

                <div class="footer-contact">
                    <Button class="btn-white font-light text-base">
                        contact@followersbicara.com
                    </Button>
                    <div class="w-px h-4 bg-border-main"></div>
                </div>
            </div>

            <div class="footer-section">
                <h6>Site Map</h6>
                <a>Home</a>
                <a>About Us</a>


            </div>

            <div class="footer-section">
                <h6>Social Media</h6>
                <a href="https://www.instagram.com/thefollowersid" target="_blank" class="flex items-center gap-2">
                    <Button class="btn-xsbtn-white btn-circle">
                        <SvgInstagram class="w-5" />
                    </Button>
                    <span>@thefollowersid</span>
                </a>
                <a href="https://www.youtube.com/@thefollowers_id" target="_blank" class="flex items-center gap-2">
                    <Button class="btn-xsbtn-white btn-circle">
                        <SvgYoutube class="w-5" />
                    </Button>
                    <span>@thefollowers_id</span>
                </a>
            </div>
            <div class="footer-section">
                <h6>Contact</h6>
                <a>Jl. Jaya Giri No 9J, Dangin Puri Klod, Kec. Denpasar Tim., Kota Denpasar, Bali 80234</a>
                <a>contact@followersbicara.com</a>
            </div>
        </footer>
        <hr>
        <div class="footer-bottom">
            <div>© {{ new Date().getFullYear() }} Followers Bicara</div>
            <Version class="text-xs" />
            <div v-if="false" class="footer-bottom-links">
                <a>Privacy Policy</a>
                <a>Terms of Service</a>
                <a>Cookies Settings</a>
                <a>Contact</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
@reference "@/assets/css/main.css";

.footer-wrapper {
    @apply bg-white-main pb-18 max-w-6xl mx-auto text-[16px] max-md:px-5 max-2xl:px-10 px-12 mt-20;
}

footer {
    @apply grid md:grid-cols-6 lg:grid-cols-10 gap-2 md:gap-4 xl:gap-7 py-10;
}

footer>div {
    @apply col-span-full;
}

footer>div:nth-child(1) {
    @apply lg:col-span-4;
}

footer>div:not(:nth-child(1)) {
    @apply md:col-span-2;
}

hr {
    @apply md:hidden;
}

.footer-bottom {
    @apply mt-4 flex max-md:flex-col-reverse gap-4 max-md:items-start justify-between items-center text-default3 font-light text-sm;
}

.footer-bottom-links {
    @apply flex max-md:flex-col gap-4
}

.footer-bottom-links>a {
    @apply link link-hover;
}

.footer-section {
    @apply flex flex-col gap-2 max-sm:mt-4 text-sm;
}

.footer-section>h6 {
    @apply text-default font-semibold mb-2;
}

.footer-section>a {
    @apply link link-hover text-default2 font-light;
}

.footer-brand>p {
    @apply font-light mt-2 md:mt-4;
}

.footer-contact {
    @apply flex flex-wrap gap-2 items-center mt-8 md:mt-10;
}

.footer-contact button {
    @apply border-none;
}
</style>
