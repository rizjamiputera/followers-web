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

// Redirect to the creator page
await navigateTo(`/creator/${username}`, { redirectCode: 301 });
</script>
