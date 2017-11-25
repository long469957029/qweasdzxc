

const newbie = [
  {
    pic: require('./newbie-1.png'),
    areas: [
      {
        className: 'js-pf-next',
        coords: [854, 265, 927, 289],
      },
      {
        className: 'js-pf-finish',
        coords: [938, 265, 976, 289],
      },
    ],
  },
  {
    pic: require('./newbie-2.png'),
    areas: [
      {
        className: 'js-pf-next',
        coords: [544, 315, 628, 343],
      },
      {
        className: 'js-pf-finish',
        coords: [639, 315, 701, 343],
      },
    ],
    // callback: function() {
    //  var $scroll = $('.js-db-ticket-scroll');
    //  var offset = $scroll.offset().top + $scroll.height() - $('body').height();
    //  if (offset > 0) {
    //    $('body').scrollTop(offset + 100);
    //  }
    // }
  },
  {
    pic: require('./newbie-3.png'),
    areas: [
      {
        className: 'js-pf-next',
        coords: [1322, 242, 1407, 269],
      },
      {
        className: 'js-pf-finish',
        coords: [1417, 243, 1478, 270],
      },
    ],
  },
  {
    pic: require('./newbie-4.png'),
    areas: [
      {
        className: 'js-pf-finish',
        coords: [1284, 190, 1384, 222],
      },
    ],
  },
]

module.exports = {
  get(index) {
    return newbie[index]
  },

  getAll(fix) {
    return _(newbie).map((newbie) => {
      return {
        pic: newbie.pic,
        callback: newbie.callback,
        areas: _(newbie.areas).map((area) => {
          return {
            className: area.className,
            coords: _(area.coords).map((coord, index) => {
              if (index % 2 === 0) {
                return coord - fix
              }
              return coord
            }),
          }
        }),
      }
    })
  },
}
