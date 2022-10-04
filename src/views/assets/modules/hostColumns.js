// 流程状态
const processStatusMap = ['待测试', '测试未通过', '测试通过', '测试中', '计费中', '已下机']
// ip协议栈
const ipStackMap = ['IPV4', 'IPV6', '双栈']
// 是否IDC
const isIdcMap = ['非IDC', 'IDC']
// 运营商
const ispMap = ['移动', '联通', '电信']
// 网络状态
const networkStatusMap = ['离线', '在线']
// 部署方式
const deploymentTypeMap = ['容器', '裸机']
// 测试结果
const evaluationResMap = ['未完成测试', '符合标准']
// 网络类型
const networkTypeMap = ['拨号一对一', '拨号一对多', '拨号多对一', '专线单IP', '专线多IP']
// 计费规则
const feeRulesMap = ['日95', '晚95', '买断', '月95', '保底']
// 结算周期
const billingCycleMap = ['月结', '日结', '周结']
// 地区
const areaMap = ['华东', '华南', '华北', '西南', '东北', '西北']
// 主机列表表头
const columns = [
    {
        title: '编号',
        dataIndex: 'no',
        fixed: 'left',
        align: 'center',
        width: '80px',
        searchType: 0
    },
    {
        title: '节点名',
        dataIndex: 'name',
        fixed: 'left',
        align: 'center',
        width: '150px',
        searchType: 0
    },
    {
        title: '节点ID',
        dataIndex: 'nodeId',
        align: 'center',
        width: '180px',
        searchType: 0
    },
    {
        title: '流程状态',
        dataIndex: 'processStatus',
        align: 'center',
        width: '100px',
        searchType: 1,
        searchMap: processStatusMap,
        scopedSlots: { customRender: 'processStatus' }
    },
    {
        title: 'IP',
        dataIndex: 'ip',
        align: 'center',
        width: '150px',
        searchType: 0
    },
    {
        title: 'IP协议栈',
        dataIndex: 'ipStack',
        align: 'center',
        width: '100px',
        searchType: 1,
        searchMap: ipStackMap,
        scopedSlots: { customRender: 'ipStack' }
    },
    {
        title: '是否IDC节点',
        dataIndex: 'isIdc',
        align: 'center',
        width: '100px',
        searchTitle: '是否IDC',
        searchType: 1,
        searchMap: isIdcMap,
        scopedSlots: { customRender: 'isIdc' }
    },
    {
        title: '地区',
        dataIndex: 'area',
        align: 'center',
        width: '100px',
        searchType: 1,
        searchMap: areaMap
    },
    {
        title: '运营商',
        dataIndex: 'isp',
        align: 'center',
        width: '100px',
        searchType: 1,
        searchMap: ispMap,
        scopedSlots: { customRender: 'isp' }
    },
    {
        title: '网络状态',
        dataIndex: 'networkStatus',
        align: 'center',
        width: '100px',
        searchType: 1,
        searchMap: networkStatusMap,
        scopedSlots: { customRender: 'networkStatus' }
    },
    {
        title: '最近在线',
        dataIndex: 'onlineTime',
        align: 'center',
        width: '180px',
        sorter: true,
        searchType: 2
    },
    {
        title: '软件/镜像版本',
        dataIndex: 'isoVersion',
        align: 'center',
        width: '150px',
        searchTitle: '镜像版本',
        searchType: 1,
        searchMap: []
    },
    {
        title: '部署方式',
        dataIndex: 'deploymentType',
        align: 'center',
        width: '100px',
        searchType: 1,
        searchMap: deploymentTypeMap,
        scopedSlots: { customRender: 'deploymentType' }
    },
    {
        title: '测评结果',
        dataIndex: 'evaluationRes',
        align: 'center',
        width: '100px',
        searchType: 1,
        searchMap: evaluationResMap,
        scopedSlots: { customRender: 'evaluationRes' }
    },
    {
        title: '硬件',
        children: [
        {
            title: '机型',
            dataIndex: 'model',
            align: 'center',
            width: '100px',
            searchType: 0
        },
        {
            title: 'CPU',
            dataIndex: 'cpu',
            customRender: (text) => text + '核',
            align: 'center',
            width: '100px',
            sorter: (a, b) => a.age - b.age,
            searchType: 0
        },
        {
            title: '内存',
            dataIndex: 'memory',
            customRender: (text) => text + 'G',
            align: 'center',
            width: '100px',
            sorter: (a, b) => a.age - b.age,
            searchType: 0
        },
        {
            title: '硬盘',
            dataIndex: 'hardDisk',
            customRender: (text) => text + 'T',
            align: 'center',
            width: '100px',
            sorter: (a, b) => a.age - b.age,
            searchType: 0
        }
        ]
    },
    {
        title: '网络类型',
        dataIndex: 'networkType',
        align: 'center',
        width: '100px',
        searchType: 1,
        searchMap: networkTypeMap,
        scopedSlots: { customRender: 'networkType' }
    },
    {
        title: 'MAC地址',
        dataIndex: 'mac',
        align: 'center',
        width: '150px',
        searchType: 0
    },
    {
        title: '上报带宽',
        dataIndex: 'reportBandwidth',
        align: 'center',
        width: '100px',
        searchType: 0
    },
    {
        title: '计费',
        children: [
        {
            title: '计费状态',
            dataIndex: 'feeStatus',
            align: 'center',
            width: '100px',
            searchType: 1,
            searchMap: []
        },
        {
            title: '计费规则',
            dataIndex: 'feeRules',
            align: 'center',
            width: '100px',
            searchType: 1,
            searchMap: feeRulesMap,
            scopedSlots: { customRender: 'feeRules' }
        },
        {
            title: '价格模式',
            dataIndex: 'priceModel',
            align: 'center',
            width: '100px',
            searchType: 1,
            searchMap: []
        },
        {
            title: '结算周期',
            dataIndex: 'billingCycle',
            align: 'center',
            width: '100px',
            searchType: 1,
            searchMap: billingCycleMap,
            scopedSlots: { customRender: 'billingCycle' }
        }
        ]
    },
    {
        title: '供应商',
        dataIndex: 'supplier',
        align: 'center',
        width: '100px',
        searchType: 0
    },
    {
        title: '上机时间',
        dataIndex: 'upTime',
        align: 'center',
        width: '180px',
        sorter: true,
        searchType: 2
    },
    {
        title: '下机时间',
        dataIndex: 'downTime',
        align: 'center',
        width: '180px',
        sorter: true,
        searchType: 2
    },
    {
        title: '对接人',
        dataIndex: 'butt',
        align: 'center',
        width: '100px',
        searchType: 0
    },
    {
        title: '客户ID',
        dataIndex: 'customerId',
        align: 'center',
        width: '100px',
        searchType: 0
    },
    {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        width: '100px',
        searchType: -1,
        scopedSlots: { customRender: 'action' }
    }
]
// 主机详情-接入信息label
const accessInfoLabel = {
    defaultIp: '默认IP',
    area: '地区',
    isp: '运营商',
    status: '招募/托管',
    OnboardType: '上机类型',
    isoVersion: '软件/镜像版本',
    isoInstallTime: '镜像安装时间',
    bingTime: '绑定时间',
    deploymentType: '部署方式',
    roomType: '机房类型',
    hasUps: '设备是否有UPS',
    downReason: '下机原因'
}
// 主机详情-硬盘表头
const harddiskColumns = [
    {
        title: '序号',
        dataIndex: 'no',
        align: 'center'
    },
    {
        title: '型号',
        dataIndex: 'model',
        align: 'center'
    },
    {
        title: '名称',
        dataIndex: 'name',
        align: 'center'
    },
    {
        title: '容量(T)',
        dataIndex: 'size',
        align: 'center'
    },
    {
        title: '类型',
        dataIndex: 'type',
        align: 'center'
    }
]
// 主机详情-内存表头
const memoryColumns = [
    {
        title: '序号',
        dataIndex: 'no',
        align: 'center'
    },
    {
        title: '型号',
        dataIndex: 'model',
        align: 'center'
    },
    {
        title: '容量(G)',
        dataIndex: 'size',
        align: 'center'
    },
    {
        title: '类型',
        dataIndex: 'type',
        align: 'center'
    }
]
// 主机详情-mac地址表头
const macColumns = [
    {
        title: '序号',
        dataIndex: 'no',
        align: 'center'
    },
    {
        title: '型号',
        dataIndex: 'model',
        align: 'center'
    },
    {
        title: '网卡名',
        dataIndex: 'name',
        align: 'center'
    },
    {
        title: 'MAC地址',
        dataIndex: 'mac',
        align: 'center'
    },
    {
        title: 'IP',
        dataIndex: 'ip',
        align: 'center'
    }
]
/// 主机详情-上报带宽表头
const bindWidthColumns = [
    {
        title: '类型',
        dataIndex: 'type',
        align: 'center'
    },
    {
        title: '线路数量',
        dataIndex: 'lineNumber',
        align: 'center'
    },
    {
        title: '单线(M)',
        dataIndex: 'lineFlow',
        align: 'center'
    }
]

export { columns, processStatusMap, ipStackMap, isIdcMap, ispMap,
    networkStatusMap, deploymentTypeMap, evaluationResMap, networkTypeMap,
    feeRulesMap, billingCycleMap, areaMap, accessInfoLabel, harddiskColumns,
    memoryColumns, macColumns, bindWidthColumns }
