<template>
    <div>v{{ version }}</div>
</template>

<script lang="ts" setup>
// @ts-ignore
import packageJson from '../../package.json'

const version = packageJson.version
</script>

<style></style>
