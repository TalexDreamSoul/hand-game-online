export function mapDeviceOrientationToNumber(alpha: number, beta: number, gamma: number) {
  // 修正 alpha 的范围在 0-360 度之间
  alpha = (alpha + 360) % 360

  // 将 alpha 分为 12 个区间（每个区间 30 度）
  const alphaIndex = Math.floor(alpha / 30)

  // 将 beta 分为 3 个区间
  let betaIndex
  if (beta < -60)
    betaIndex = 0
  else if (beta < 60)
    betaIndex = 1
  else
    betaIndex = 2

  // 将 gamma 分为 3 个区间
  let gammaIndex
  if (gamma < -30)
    gammaIndex = 0
  else if (gamma < 30)
    gammaIndex = 1
  else
    gammaIndex = 2

  // 通过 betaIndex 和 gammaIndex 计算一个 0-8 的索引
  const betaGammaIndex = betaIndex * 3 + gammaIndex

  // 通过 alphaIndex 和 betaGammaIndex 计算一个 0-11 的索引
  const number = (alphaIndex % 12) + (betaGammaIndex % 3)

  return number
}

export function mapDeviceOrientationToRange(alpha: number, beta: number, gamma: number, maximum: number) {
  // 修正 alpha 的范围在 0-360 度之间
  alpha = (alpha + 360) % 360

  // 将 alpha 标准化到 [0, 1] 之间
  const normalizedAlpha = alpha / 360

  // 将 beta 标准化到 [0, 1] 之间，范围 -180 到 180
  const normalizedBeta = (beta + 180) / 360

  // 将 gamma 标准化到 [0, 1] 之间，范围 -90 到 90
  const normalizedGamma = (gamma + 90) / 180

  // 将标准化的 alpha, beta, gamma 的值组合起来
  // 计算一个 0 到 1 的综合值
  const combinedValue = (normalizedAlpha + normalizedBeta + normalizedGamma) / 3

  // 将综合值映射到 0 到 maximum 之间
  const result = Math.floor(combinedValue * maximum)

  return result
}

export function orientation(alpha: number, beta: number, gamma: number, number: number) {
  // 修正 alpha 的范围在 0-360 度之间
  alpha = (alpha + 360) % 360

  // 将 alpha 标准化到 [1, 12] 之间表示月份
  const month = Math.ceil((alpha / 360) * 12)

  // 获取当前月份的天数
  const daysInMonth = (month: number) => {
    return new Date(2024, month, 0).getDate()
  }

  const maxDays = daysInMonth(month)

  // 标准化 beta 和 gamma 到 [0, 1] 之间
  const normalizedBeta = (beta + 180) / 360
  const normalizedGamma = (gamma + 90) / 180

  // 计算一个标准化值并结合随机数
  const combinedValue = (normalizedBeta + normalizedGamma + number) / 3

  // 将标准化值映射到当前月份的天数
  let day = Math.ceil(combinedValue * maxDays)

  // 确保 day 在 1 到 maxDays 之间
  day = Math.max(1, Math.min(day, maxDays))

  return [month, day]
}

export function isBetween18And25(birthDate: string, currentDate: string) {
  // 将日期转换为 Date 对象
  const birth = new Date(birthDate)
  const current = new Date(currentDate)

  // 计算年龄
  let age = current.getFullYear() - birth.getFullYear()
  const monthDifference = current.getMonth() - birth.getMonth()
  const dayDifference = current.getDate() - birth.getDate()

  // 调整年龄计算，如果当前月份或日期还没到生日月份或日期，则年龄减一
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0))
    age--

  // 判断年龄是否在 18 到 25 之间
  return age >= 18 && age < 25
}

export function isValidIDCard(idCard: string) {
  // 18位身份证号码正则表达式
  const idCardPattern = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/

  if (!idCardPattern.test(idCard))
    return false

  // 校验码计算
  const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const checksums = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  const idCardArray: any[] = idCard.split('')

  // 计算校验码
  let sum = 0
  for (let i = 0; i < 17; i++)
    sum += idCardArray[i] * factors[i]

  const checksum = checksums[sum % 11]

  // 验证校验码
  return checksum === idCardArray[17]
}

export function extractBirthDateFromID(idCard: string) {
  // 18位身份证号码正则表达式
  const idCardPattern = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/

  if (!idCardPattern.test(idCard))
    return [-1, -1, -1]

  // 提取出生日期部分
  const birthYear = idCard.substring(6, 10)
  const birthMonth = idCard.substring(10, 12)
  const birthDay = idCard.substring(12, 14)

  return [birthYear, birthMonth, birthDay]
}
