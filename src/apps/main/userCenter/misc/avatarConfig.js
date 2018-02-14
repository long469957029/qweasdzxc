/**
 * Created by steven on 2018/1/5.
 */
const avatars = [
  {
    id: '1',
    logo: require('base/images/avatar/avatar-1.png'),
    className: 'avatars1',
  },
  {
    id: '2',
    logo: require('base/images/avatar/avatar-2.png'),
    className: 'avatars2',
  },
  {
    id: '3',
    logo: require('base/images/avatar/avatar-3.png'),
    className: 'avatars3',
  },
  {
    id: '4',
    logo: require('base/images/avatar/avatar-4.png'),
    className: 'avatars4',
  },
  {
    id: '5',
    logo: require('base/images/avatar/avatar-5.png'),
    className: 'avatars5',
  },
  {
    id: '6',
    logo: require('base/images/avatar/avatar-6.png'),
    className: 'avatars6',
  },
  {
    id: '7',
    logo: require('base/images/avatar/avatar-7.png'),
    className: 'avatars7',
  },
  {
    id: '8',
    logo: require('base/images/avatar/avatar-8.png'),
    className: 'avatars8',
  },
  {
    id: '9',
    logo: require('base/images/avatar/avatar-9.png'),
    className: 'avatars9',
  },
  {
    id: '10',
    logo: require('base/images/avatar/avatar-10.png'),
    className: 'avatars10',
  },
  {//
    id: '11',
    logo: require('base/images/avatar/avatar-11.png'),
    className: 'avatars11',
  },
  {//
    id: '12',
    logo: require('base/images/avatar/avatar-12.png'),
    className: 'avatars12',
  },
  {
    id: '13',
    logo: require('base/images/avatar/avatar-13.png'),
    className: 'avatars13',
  },
  {
    id: '14',
    logo: require('base/images/avatar/avatar-14.png'),
    className: 'avatars14',
  },
  {
    id: '15',
    logo: require('base/images/avatar/avatar-15.png'),
    className: 'avatars15',
  },
  {
    id: '16',
    logo: require('base/images/avatar/avatar-16.png'),
    className: 'avatars16',
  },
  {
    id: '17',
    logo: require('base/images/avatar/avatar-17.png'),
    className: 'avatars17',
  },
  {
    id: '18',
    logo: require('base/images/avatar/avatar-18.png'),
    className: 'avatars18',
  },
  {
    id: '19',
    logo: require('base/images/avatar/avatar-19.png'),
    className: 'avatars19',
  },
  {
    id: '20',
    logo: require('base/images/avatar/avatar-20.png'),
    className: 'avatars20',
  },
  {
    id: undefined,
    logo: require('base/images/avatar/avatar-20.png'),
    className: 'avatars20',
  },
]

module.exports = {
  get(id) {
    return _(avatars).findWhere({
      id,
    })
  },
  avatars,
}
