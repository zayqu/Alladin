<template>
  <div>
    <Spinner />
    <router-view></router-view>
  </div>
</template>

<script setup>
import Spinner from "./components/Spinner.vue";
</script>
