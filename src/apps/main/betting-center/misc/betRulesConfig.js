import factory from './betRulesFactory'


const SscFactory = require('./betRulesFactory-ssc')
const ChooseFactory = require('./betRulesFactory-choose5')
const ThreeDFactory = require('./betRulesFactory-3d')
const P5P3Factory = require('./betRulesFactory-p5p3')

const BjPKFactory = require('./betRulesFactory-bjpk')
const Quick3Factory = require('./betRulesFactory-quick3')

// 盘口
const HandicapSccFactory = require('./betRulesFactory-handicap-ssc')
const HandicapPk10Factory = require('./betRulesFactory-handicap-pk10')

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

const Mark6Factory = require('./betRulesFactory-handicap-mark6')
const mark6List = ticketConfig.getMark6List()
_(mark6List).each((six) => {
  Mark6Factory.install(six.id)
})


const handicapSscList = ticketConfig.getHandicapSscList()
_(handicapSscList).each((six) => {
  HandicapSccFactory.install(six.id)
})

const handicapPk10List = ticketConfig.getHandicapPk10List()
_(handicapPk10List).each((six) => {
  HandicapPk10Factory.install(six.id)
})

const _betRules = _(factory.betRules)

export default {
  get(ids) {
    const play = _betRules.findWhere({
      playId: ids,
    })
    return play && play.rule || {}
  },
}
