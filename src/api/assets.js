import request from '@/utils/request'

const api = {
  host: '/host/list',
  hostDetail: '/host/detail',
  operHost: '/host/oper',
  editHost: '/host/edit'
}

export default api
// 主机列表
export function getHostList (parameter) {
    return request({
        url: api.host,
        method: 'get',
        params: parameter
    })
}
// 主机详情
export function getHostDetail (parameter) {
    return request({
        url: api.hostDetail,
        method: 'get',
        params: parameter
    })
}
// 删除/上机/下机
export function operHost (parameter) {
    return request({
        url: api.operHost,
        method: 'get',
        params: parameter
    })
}
// 新增/编辑主机
export function editHost (parameter) {
    return request({
        url: api.editHost,
        method: 'get',
        params: parameter
    })
}
