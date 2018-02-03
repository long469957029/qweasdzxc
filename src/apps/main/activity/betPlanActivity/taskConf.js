/**
 * Created by steven on 2018/2/3.
 */

const taskList=[
  {
    id:0,
    name:'任务一',
    detailName:'任务1',
  },
  {
    id:1,
    name:'任务二',
    detailName:'任务2',
  },
  {
    id:2,
    name:'任务三',
    detailName:'任务3',
  },
  {
    id:3,
    name:'任务四',
    detailName:'任务4',
  },
  {
    id:4,
    name:'任务五',
    detailName:'任务5',
  },
  {
    id:5,
    name:'任务六',
    detailName:'任务6',
  },
]
module.exports = {
  get(id) {
    return _(taskList).findWhere({
      id,
    })
  },
}
