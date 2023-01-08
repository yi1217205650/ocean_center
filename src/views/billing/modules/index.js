// 计费规则
const feeRulesMap = {
  '0': '日95',
  '1': '晚95',
  '2': '买断',
  '3': '月95',
  '4': '保底'
}
// 价格模式
const feeModelMap = {
  '0': '移动公网',
  '1': '移动内网',
  '2': '移动城域网',
  '3': '电联公网'
}
// 列表表头
const CustomerColumns = [
  {
    title: '客户ID',
    dataIndex: 'uid',
    align: 'center',
    searchType: 1
  },
  {
    title: '客户',
    dataIndex: 'name',
    align: 'center',
    searchType: 1,
    searchTitle: '客户名'
  },
  {
    title: '计费模式',
    dataIndex: 'model',
    align: 'center',
    searchType: 2,
    searchMap: feeModelMap
  },
  {
    title: '计费规则',
    dataIndex: 'rules',
    align: 'center',
    searchType: 2,
    searchMap: feeRulesMap
  },
  {
    title: '昨日峰值',
    dataIndex: 'yes_max',
    align: 'center'
  },
  {
    title: '昨日95',
    dataIndex: 'yes_95',
    align: 'center'
  },
  {
    title: '昨日结算(元)',
    dataIndex: 'yes_money',
    align: 'center'
  },
  {
    title: '结算时间',
    dataIndex: 'time',
    align: 'center'
  }
]
const UserColumns = [
  {
    title: '用户ID',
    dataIndex: 'uid',
    align: 'center',
    searchType: 1
  },
  {
    title: '用户',
    dataIndex: 'name',
    align: 'center',
    searchType: 1,
    searchTitle: '用户名'
  },
  {
    title: '计费模式',
    dataIndex: 'model',
    align: 'center',
    searchType: 2,
    searchMap: feeModelMap
  },
  {
    title: '计费规则',
    dataIndex: 'rules',
    align: 'center',
    searchType: 2,
    searchMap: feeModelMap
  },
  {
    title: '昨日峰值',
    dataIndex: 'yes_max',
    align: 'center'
  },
  {
    title: '昨日95',
    dataIndex: 'yes_95',
    align: 'center'
  },
  {
    title: '昨日结算(元)',
    dataIndex: 'yes_money',
    align: 'center'
  },
  {
    title: '结算时间',
    dataIndex: 'time',
    align: 'center'
  }
]
export { CustomerColumns, UserColumns }
