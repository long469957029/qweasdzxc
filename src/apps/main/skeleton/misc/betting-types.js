export const SSC = {
  range: _.range(10),
  count: 5,
  openingType: 'balls',
  defaultOpening: [0, 0, 0, 0, 0],
  defaultSelectPlay: 4,
}

export const CHOOSE15 = {
  range: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'],
  count: 5,
  openingType: 'balls',
  defaultOpening: R.repeat(0, 5),
  defaultSelectPlay: '4,0,4'
}

export const DPC = {
  range: _.range(10),
  count: 3,
  openingType: 'balls',
  defaultOpening: R.repeat(0, 3),
  defaultSelectPlay: 0,
}

export const P5P3 = {
  range: _.range(10),
  count: 5,
  openingType: 'balls',
  defaultOpening: R.repeat(0, 5),
  defaultSelectPlay: 0,
}

export const PK10 = {
  range: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
  count: 10,
  openingType: 'balls',
  defaultOpening: R.repeat(0, 10),
  defaultSelectPlay: 4,
}
