<script setup lang="ts">
import { useDeviceMotion, useDeviceOrientation } from '@vueuse/core'

const router = useRouter()

const mentions = reactive<Array<{ err: boolean, msg: string }>>([])
const birth = reactive({
  year: 5000,
  month: 0,
  day: 0,
})

const motion = useDeviceMotion()
const {
  acceleration,
  accelerationIncludingGravity,
} = motion

const {
  isAbsolute,
  alpha,
  beta,
  gamma,
} = useDeviceOrientation()

watch(() => acceleration.value, (val) => {
  console.log('acceleration xyz a-speed', val)
})

watch(() => accelerationIncludingGravity.value, (val) => {
  console.log('acceleration gravity xyz a-speed', val)
})

function getPermission() {
  if (
    typeof window.DeviceMotionEvent !== 'undefined'
    && typeof window.DeviceMotionEvent.requestPermission === 'function'
  ) {
    window.DeviceMotionEvent.requestPermission()
      .then((state) => {
        if (state === 'granted') {
          // 用户同意授权

        }
        else {
          // 用户拒绝授权
          alert('摇一摇需要授权设备运动权限,请重启应用后,再次进行授权!')
        }
      })
      .catch((err) => {
        alert(`error: ${err}`)
      })
  }
}

/**
 * 设计规则：
 * 1. 输入身份证号
 * 2. 输入出生年份 （必须匹配身份证号） 用0-100000滑块条
 * 3. 陀螺仪来计算月份
 * 4. 加速度来计算日期
 */

const birthText = computed(() => {
  return `${birth.year - 5000}-${birth.month}-${birth.day}`
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
    <input
      v-model="birth.year"
      w-80
      type="range"
      min="0"
      max="10000"
      value="5000"
      oninput="rangeValue.innerText = this.value"
    >
    <p op-75>
      上抛手机输入日期！
    </p>
    {{ {
      isAbsolute,
      alpha,
      beta,
      gamma,
    } }}
    <p>你的生辰是：{{ birthText }}</p>
    <button w-full @click="getPermission">
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
