<script setup lang="ts">
import Account from './login/account.vue'
</script>

<template>
  <div h-full w-full flex flex-col items-center justify-center>
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
</style>
