const getAddressApi = (then, fail) => {
  return $http({
    url: '/info/city/list.json',
  })
    .then(then)
    .catch(fail)
}

export {
  getAddressApi,
}
