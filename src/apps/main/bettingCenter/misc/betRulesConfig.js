import factory from 'bettingCenter/misc/betRulesFactory'

const ticketConfig = require('skeleton/misc/ticketConfig')

const SscFactory = require('bettingCenter/misc/betRulesFactory-ssc')
const ChooseFactory = require('bettingCenter/misc/betRulesFactory-choose5')
const ThreeDFactory = require('bettingCenter/misc/betRulesFactory-3d')
const P5P3Factory = require('bettingCenter/misc/betRulesFactory-p5p3')

const BjPKFactory = require('bettingCenter/misc/betRulesFactory-bjpk')
const Quick3Factory = require('bettingCenter/misc/betRulesFactory-quick3')

//盘口
const Mark6Factory = require('bettingCenter/misc/betRulesFactory-handicap-mark6')

const sscList = ticketConfig.getSccList()
_(sscList).each((ssc) => {
  SscFactory.install(ssc.id)
})

const choose5List = ticketConfig.getChoose5List()
_(choose5List).each((choose5) => {
  ChooseFactory.install(choose5.id)
})

const threeDList = ticketConfig.get3DList()
_(threeDList).each((threeD) => {
  ThreeDFactory.install(threeD.id)
})

const p5P3List = ticketConfig.getP5P3List()
_(p5P3List).each((p5P3) => {
  P5P3Factory.install(p5P3.id)
})

const bjPKList = ticketConfig.getBjPkList()
_(bjPKList).each((bjpk) => {
  BjPKFactory.install(bjpk.id)
})

const quick3List = ticketConfig.getQuickList()
_(quick3List).each((quick) => {
  Quick3Factory.install(quick.id)
})

const mark6List = ticketConfig.getMark6List()
_(mark6List).each((six) => {
  Mark6Factory.install(six.id)
})

const _betRules = _(factory.betRules)

export default {
  get(ids) {
    const play = _betRules.findWhere({
      playId: ids,
    })
    return play && play.rule || {}
  },
  getMark6SpecialInfo () {
    return Mark6Factory.getMark6SpecialInfo()
  },
}
