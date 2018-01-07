export const SSC = {
  range: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  counts: 5,
  openingType: 'balls',
  defaultOpening: R.repeat('0', 5),
  defaultSelectPlay: '4',
}

export const CHOOSE15 = {
  range: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'],
  counts: 5,
  openingType: 'balls',
  defaultOpening: R.repeat('0', 5),
  defaultSelectPlay: '4,0,4',
}

export const DPC = {
  range: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  counts: 3,
  openingType: 'balls',
  defaultOpening: R.repeat('0', 3),
  defaultSelectPlay: '0',
}

export const P5P3 = {
  range: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  counts: 5,
  openingType: 'balls',
  defaultOpening: R.repeat('0', 5),
  defaultSelectPlay: '0',
}

export const PK10 = {
  range: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
  counts: 10,
  openingType: 'balls',
  defaultOpening: R.repeat('0', 10),
  defaultSelectPlay: '4',
}

export const QUICK3 = {
  range: ['1', '2', '3', '4', '5', '6'],
  counts: 3,
  openingType: 'dices',
  defaultOpening: R.repeat('3', 3),
  defaultSelectPlay: '9',
}
