<script setup lang="ts">
import Account from './account.vue'
</script>

<template>
  <div class="Login-Page" h-full w-full flex flex-col items-center justify-center>
    <div class="Login-Wrapper">
      <Account />
    </div>
  </div>
</template>

<style>
.Login-Wrapper {
  position: absolute;

  top: 50%;
  left: 50%;

  width: 50%;
  min-height: 240px;

  color: #fff;
  transform: translate(-50%, -50%);
}

@media screen and (max-width: 1080px) {
  .Login-Wrapper {
    position: relative;

    width: 100%;
    height: 100%;

    min-height: unset;

    overflow-y: scroll;
  }

  .Login-Page {
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    overflow: hidden;
  }
}
</style>
