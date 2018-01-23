function numRand() {
  const x = 9999 // 上限
  const y = 1111 // 下限
  const rand = parseInt(Math.random() * (x - y + 1) + y)
  return rand
}

let isBegin = false
$(() => {
  const u = 265
  $('.btn').click(() => {
    if (isBegin) return false
    isBegin = true
    $('.num').css('backgroundPositionY', 0)
    const result = numRand()
    $('#res').text(`摇奖结果 = ${result}`)
    const num_arr = (`${result}`).split('')
    $('.num').each(function (index) {
      const _num = $(this)
      setTimeout(() => {
        _num.animate({
          backgroundPositionY: (u * 60) - (u * num_arr[index]),
        }, {
          duration: 6000 + index * 3000,
          easing: 'easeInOutCirc',
          complete() {
            if (index == 3) isBegin = false
          },
        })
      }, index * 300)
    })
  })
})()
