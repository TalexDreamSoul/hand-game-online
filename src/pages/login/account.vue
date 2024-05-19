<script setup lang="ts">
import { validationMiddlewares } from './account-validation'

const mentions = reactive<Array<{ err: boolean, msg: string }>>([])
const account = ref('')

watch(
  () => account.value,
  (value) => {
    let errAmo = 0
    mentions.length = 0;

    [...validationMiddlewares].forEach((item) => {
      if (errAmo >= 1)
        return

      const [err, msg] = item(value)

      if (!err)
        errAmo += 1

      mentions.push({
        err: !err,
        msg,
      })
    })

    mentions.reverse()
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="Login-Container"
    h-full
    w-full
    flex
    flex-col
    items-center
    justify-center
    gap-10
  >
    <p text-3xl font-bold>
      要登录，你需要输入你的账号...
    </p>
    <input v-model="account" h-10 w-full border-rounded text-2xl>
    <button w-full>
      登录
    </button>
  </div>

  <div
    :class="{ display: mentions?.length }"
    :style="`--h: ${mentions?.length * 60}px`"
    class="Login-Mention"
  >
    <div
      v-for="(item, ind) in mentions"
      :key="ind"
      :class="{ err: item.err }"
      class="Login-Mention-Item"
    >
      {{ item.msg }}
    </div>
  </div>
</template>

<style>
.Login-Mention-Item.err {
  border-left: 2px solid #ff0000;
}

.Login-Mention-Item {
  position: relative;
  display: flex;

  font-size: 18px;
  text-indent: 2rem;
  align-items: center;

  top: 0;
  left: 0;

  width: 95%;
  height: 50px;
  text-align: left;

  flex: 1;
  border-radius: 8px;
  background-color: #0e0f0f80;
  border-left: 2px solid #25aef3;
}

.Login-Mention.display {
  padding: 1rem 0;

  height: calc(var(--h, 0px) + 2rem);
}

.Login-Mention {
  position: relative;
  padding: 0;
  display: flex;
  margin-top: 2rem;

  gap: 10px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 0;

  transition: 0.25s;
  border-radius: 12px;
  background-color: #1e1f1f;
}

@media (max-width: 768px) {
  .Login-Mention {
    position: absolute;
    margin-top: 1rem;

    top: 30%;
  }

  .Login-Container {
    /* position: sticky; */

    top: 0;

    height: 30%;
  }
}

.Login-Container {
  padding: 2rem;

  border-radius: 12px;
  background-color: #1e1f1f;
}
</style>
