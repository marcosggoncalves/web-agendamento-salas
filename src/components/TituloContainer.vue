<template>
    <div :class="isColunaDisplay ? 'isColuna titulo-container' : 'titulo-container'">
        <h1>{{ title }}</h1>
        <slot class="slot"></slot>
    </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
    title: String,
    isColunaDisplay: {
        type: Boolean,
        default: false
    },
});
</script>
 