<template>
    <div>
        <!-- This route handles @username URLs -->
        <!-- Redirect to the creator detail page -->
    </div>
</template>

<script lang="ts" setup>
// Get the slug from the route
const route = useRoute();
const username = route.params.username as string;

// Redirect to the canonical creator page. `replace: true` swaps this route
// out of history so the back button doesn't bounce off the redirect.
await navigateTo(`/creator/${username}`, { redirectCode: 301, replace: true });
</script>
