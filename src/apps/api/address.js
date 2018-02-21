const getProvinceApi = (then, fail) => {
  return $http({
    url: '/city/provincelist.json',
  })
    .then(then)
    .catch(fail)
}

const getCityApi = ({province}, then, fail) => {
  return $http({
    url: '/city/citylist.json',
    data: {
      province
    }
  })
    .then(then)
    .catch(fail)
}

const getAreaApi = ({cityId}, then, fail) => {
  return $http({
    url: '/city/areaList.json',
    data: {
      cityId
    }
  })
    .then(then)
    .catch(fail)
}

export {
  getProvinceApi,
  getCityApi,
  getAreaApi
}
