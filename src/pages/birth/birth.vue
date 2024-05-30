<script setup lang="ts">
import { useDeviceOrientation } from '@vueuse/core'
import {
  extractBirthDateFromID,
  isBetween18And25,
  isValidIDCard,
  orientation,
} from './birth-util'

const router = useRouter()

const mentions = reactive<Array<{ err: boolean, msg: string }>>([])

const { alpha, beta, gamma } = useDeviceOrientation()

const random = Date.now()

const birth: any = reactive({
  card: '',
  year: 0,
  month: computed(
    () => orientation(alpha.value ?? 0, beta.value ?? 0, gamma.value ?? 0, random)[0],
  ),
  day: computed(
    () => orientation(alpha.value ?? 0, beta.value ?? 0, gamma.value ?? 0, random)[1],
  ),
})

/**
 * 设计规则：
 * 1. 输入身份证号
 * 2. 输入出生年份 （必须匹配身份证号） 用0-100000滑块条
 * 3. 陀螺仪来计算月份/日期
 */

const birthText = ref('')

watchEffect(() => {
  mentions.length = 0

  const _mentions = []

  _mentions.push({
    err: !isValidIDCard(String(birth.card).toUpperCase()),
    msg: '必须输入合法的身份证号码',
  })

  const date = new Date()
  _mentions.push({
    err: !isBetween18And25(
      `${birth.year - 0}-${birth.month}-${birth.day}`,
      `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`,
    ),
    msg: '年龄必须介于18-25岁之间',
  })

  // 年月日要和身份证号码相同
  const birthDate = extractBirthDateFromID(String(birth.card).toUpperCase())
  _mentions.push({
    err: +birthDate[0] !== +birth.year,
    msg: '输入的年份无法与身份证匹配',
  })

  _mentions.push({
    err: +birthDate[1] !== +birth.month,
    msg: '输入的月份无法与身份证匹配',
  })

  _mentions.push({
    err: +birthDate[2] !== +birth.day,
    msg: '输入的日期无法与身份证匹配',
  })

  for (const item of _mentions) {
    mentions.push(item)

    if (item.err)
      break
  }

  mentions.reverse()

  birthText.value = `${birth.year - 0}/${birth.month}/${birth.day}`
})
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
    gap-4
  >
    <p text-1xl font-bold>
      输入你的生辰以继续
    </p>
    <input v-model="birth.card" w-80 placeholder="你的身份证号">
    <input v-model="birth.year" w-80 type="range" min="1700" max="2300" value="0">
    <p>你的生辰是：{{ birthText }}</p>
    <button w-full>
      <span v-if="!mentions?.[0]?.err" @click="router.push('/birth')">登录</span>
      <span v-else op-50>无法完成登录</span>
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
.Login-Container textarea:focus-within {
  outline: none;
}

.Login-Container textarea {
  border-radius: 8px;
  border: 1px solid #25aef3;
}

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

@media (max-width: 1080px) {
  .Login-Mention {
    position: absolute;
    margin-top: 1rem;

    top: 30%;

    border-radius: 18px 18px 0 0;
  }

  div.Login-Container {
    z-index: 1;
    position: sticky;

    top: 0;

    height: 30%;

    border-radius: 0 0 18px 18px;
  }
}

.Login-Container {
  padding: 2rem;

  border-radius: 12px;
  background-color: #1e1f1f;
}
</style>
