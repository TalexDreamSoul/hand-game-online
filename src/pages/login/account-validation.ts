export type IValidationMiddleware = (val: string) => [boolean, string]

export const validationMiddlewares = new Array<IValidationMiddleware>()

validationMiddlewares.push(
  (val: string) => {
    if (val.length < 8)
      return [false, '必须大于8位']
    else return [true, '必须大于8位']
  },
)

validationMiddlewares.push(
  (val: string) => {
    if (val.length > 50)
      return [false, '必须小于50位']
    else return [true, '必须小于50位']
  },
)

validationMiddlewares.push(
  (val: string) => {
    if (!/[A-Z]/.test(val))
      return [false, '必须要有大写字母']
    else return [true, '必须要有大写字母']
  },
)

validationMiddlewares.push(
  (val: string) => {
    if (!/[a-z]/.test(val))
      return [false, '必须要有小写字母']
    else return [true, '必须要有小写字母']
  },
)

validationMiddlewares.push(
  (val: string) => {
    let accum = 0;

    [...val].forEach((item) => {
      if (Number.isInteger(+item))
        accum += +item
      if (['I', 'V', 'X'].includes(item))
        accum += ['I', 'V', 'X'].indexOf(item)
      else if (['i', 'v', 'x'].includes(item))
        accum += ['i', 'v', 'x'].indexOf(item)
    })

    if (accum !== new Date().getMinutes())
      return [false, '数字之和必须等于当前分钟！']
    else return [true, '数字之和必须等于当前分钟！']
  },
)

validationMiddlewares.push(
  (val: string) => {
    if (!/[^A-Za-z0-9]/.test(val))
      return [false, '必须包含特殊字符']
    else return [true, '必须包含特殊字符']
  },
)

validationMiddlewares.push(
  (val: string) => {
    if (/[0-9]/.test(val.slice(0, 15)))
      return [false, '账号前15位不能有数字']
    else return [true, '账号前15位不能有数字']
  },
)

// 账号必须以百家姓为开头
const hundredNames = ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗', '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜', '范', '方', '石', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '常', '龙', '万', '段', '漕', '钱', '汤', '文', '武', '乔', '贺', '赖', '龚', '文']
validationMiddlewares.push(
  (val: string) => {
    if (hundredNames.includes(val.slice(0, 1)))
      return [true, '账号必须以百家姓为开头']
    else return [false, '账号必须以百家姓为开头']
  },
)

// 账号中不能有连续的数字
validationMiddlewares.push(
  (val: string) => {
    let matched = true

    let last = -1;

    [...val].forEach((item) => {
      if (!matched)
        return

      if (!Number.isInteger(+item))
        return

      const num = +item
      if (last === -1)
        return last = num

      if (num === last)
        matched = false
      else last = num
    })

    return [matched, '不能有连续数字出现']
  },
)

// 账号中不能有连续的大写字母
validationMiddlewares.push(
  (val: string) => {
    let matched = true
    let last = '';

    [...val].forEach((item) => {
      if (!matched)
        return

      // 大小写字母都要检测
      if (!/[A-Z]/.test(item) && !/[a-z]/.test(item))
        return

      if (last === '')
        return last = item

      if (item === last)
        matched = false
      else last = item
    })

    return [matched, '不能有连续字母出现']
  },
)

// 不能有大小写字母挨着 就是一个大写一个小写 或者 一个小写一个大写
validationMiddlewares.push(
  (val: string) => {
    let matched = true
    let last = '';

    [...val].forEach((item) => {
      if (!matched)
        return

      // 大小写字母都要检测
      if (!/[A-Z]/.test(item) && !/[a-z]/.test(item))
        return

      if (last === '')
        return last = item

      // 如果last是大写
      if (/[A-Z]/.test(last)) {
        if (!/[a-z]/.test(item))
          matched = false
        else last = item
      }
      // 如果last是小写
      else {
        if (!/[A-Z]/.test(item))
          matched = false
        else last = item
      }
    })

    return [matched, '不能有大小写字母交替出现']
  },
)

// 必须有16进制合法的颜色
validationMiddlewares.push(
  (val: string) => {
    if (/^#[0-9a-fA-F]{6}$/.test(val))
      return [true, '必须包含16进制颜色']
    else return [false, '必须包含16进制颜色']
  },
)

// 不能有多余3个的汉字
validationMiddlewares.push(
  (val: string) => {
    if (/[\u4E00-\u9FA5]{3,}/.test(val))
      return [false, '不能有多余3个汉字']
    else return [true, '不能有多余3个汉字']
  },
)

// 特殊字符不能连续出现
validationMiddlewares.push(
  (val: string) => {
    let matched = true
    let last = '';

    [...val].forEach((item) => {
      if (!matched)
        return

      // 特殊字符都要检测
      if (!/[^A-Za-z0-9]/.test(item))
        return

      if (last === '')
        return last = item

      if (item === last)
        matched = false
      else last = item
    })

    return [matched, '不能有连续特殊字符出现']
  },
)

// 必须以当前的小时结尾
validationMiddlewares.push(
  (val: string) => {
    if (val.slice(-2) === String(new Date().getHours().toString()).padStart(2, '0'))
      return [true, '必须以当前的小时结尾']
    else return [false, '必须以当前的小时结尾']
  },
)

// 密码中必须包含touch
validationMiddlewares.push(
  (val: string) => {
    if (val.includes('touch'))
      return [true, '密码中必须包含touch']
    else return [false, '密码中必须包含touch']
  },
)

// 密码中必须包含空格
validationMiddlewares.push(
  (val: string) => {
    if (val.includes(' '))
      return [true, '密码中必须包含空格']
    else return [false, '密码中必须包含空格']
  },
)

// 密码中的空格后面那位必须是5
validationMiddlewares.push(
  (val: string) => {
    if (val.includes(' ')) {
      const index = val.indexOf(' ')
      if (val[index + 1] === '5')
        return [true, '密码中的空格后面那位必须是5']
      else return [false, '密码中的空格后面那位必须是5']
    }
    else { return [true, '密码中的空格后面那位必须是5'] }
  },
)

// 密码中必须包含罗马数字
validationMiddlewares.push(
  (val: string) => {
    if (/[IVXLCDM]/.test(val))
      return [true, '密码中必须包含罗马数字']
    else return [false, '密码中必须包含罗马数字']
  },
)