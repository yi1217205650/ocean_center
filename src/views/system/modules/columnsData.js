import store from '@/store/index'
const roleList = store.state.user.roleList
const statusList = ['异常', '正常']
// 用户表格列
const userColumns = [
  {
    title: '用户名',
    dataIndex: 'name',
    searchType: 0,
    scopedSlots: { customRender: 'userName' }
  },
  {
    title: '登录账号',
    dataIndex: 'username',
    searchType: 0
  },
  {
    title: '角色',
    dataIndex: 'roles',
    width: '100px',
    align: 'center',
    searchMap: roleList,
    searchType: 1,
    scopedSlots: { customRender: 'roles' }
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    searchType: 0
  },
  {
    title: '电话',
    dataIndex: 'telephone',
    searchType: 0
  },
  {
    title: '最近在线',
    dataIndex: 'updated_at',
    width: '180px',
    searchType: 2
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '100px',
    align: 'center',
    searchMap: statusList,
    searchType: 1,
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '180px',
    align: 'center',
    searchType: -1,
    scopedSlots: { customRender: 'action' }
  }
]

// 角色表格列
const roleColumns = [
  {
    title: '角色名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'roleName' }
  },
  {
    title: '角色说明',
    dataIndex: 'describe'
  },
  // {
  //   title: '默认',
  //   dataIndex: 'status',
  //   width: '100px',
  //   align: 'center',
  //   scopedSlots: { customRender: 'isDefault' }
  // },
  {
    title: '添加时间',
    dataIndex: 'created_at'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

const roleDrawColumns = [
  {
    title: '模块',
    dataIndex: 'module',
    width: '100px',
    customRender: (value, row, index) => {
      const obj = {
        children: value,
        attrs: {
          rowSpan: row.rowSpan
        }
      }
      return obj
    }
  },
  {
    title: '页面',
    dataIndex: 'page',
    scopedSlots: { customRender: 'page' }
  },
  {
    title: '功能',
    dataIndex: 'actions',
    scopedSlots: { customRender: 'actions' }
  }
]

export { roleList, userColumns, statusList, roleColumns, roleDrawColumns }
