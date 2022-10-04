<template>
  <a-drawer
    placement="right"
    :closable="false"
    :visible="visible"
    @close="$emit('drawClose')"
    width="80%"
  >
    <a-timeline v-if="info">
      <!-- 接入信息 -->
      <a-timeline-item>
        <div>接入信息</div>
        <a-descriptions title=" " size="small" :column="2" bordered>
          <a-descriptions-item v-for="(item,key) in info.accessInfo" :label="labelList[key]" :key="key">
            <span v-if="key == 'isp' || key == 'deploymentType' || key == 'status' || key == 'hasUps'">
              {{ mapObj[key][item] }}
            </span>
            <span v-else>{{ item }}</span>
          </a-descriptions-item>
        </a-descriptions>
      </a-timeline-item>
      <!-- 系统信息 -->
      <a-timeline-item>
        <div>系统信息</div>
        <a-descriptions title=" " size="small" :column="2" bordered>
          <a-descriptions-item label="操作系统">
            {{ info.systemInfo.system }}
          </a-descriptions-item>
          <a-descriptions-item label="内核版本">
            {{ info.systemInfo.kernelVersion }}
          </a-descriptions-item>
          <a-descriptions-item label="防火墙">
            {{ info.systemInfo.firewall == 0 ? '关闭' : '开启' }}
          </a-descriptions-item>
          <a-descriptions-item label="主机名">
            {{ info.systemInfo.hostName }}
          </a-descriptions-item>
        </a-descriptions>
      </a-timeline-item>
      <!-- 硬件信息 -->
      <a-timeline-item>
        <div>硬件信息</div>
        <a-descriptions title=" " size="small" :column="2" bordered>
          <a-descriptions-item label="机型" :span="2">
            {{ info.hardwareInfo.model }}
          </a-descriptions-item>
          <a-descriptions-item label="CPU" :span="2">
            <a-row>
              <a-col :span="8">
                型号：{{ info.hardwareInfo.cpuModel }}
              </a-col>
              <a-col :span="8">
                核数：{{ info.hardwareInfo.cpuKernel }}
              </a-col>
              <a-col :span="8">
                主频：{{ info.hardwareInfo.cpuHz }}
              </a-col>
            </a-row>
          </a-descriptions-item>
          <a-descriptions-item label="硬盘" :span="2">
            <a-space direction="vertical">
              <div>合计(T)：{{ info.hardwareInfo.diskTotal }}</div>
              <a-table
                rowKey="no"
                :columns="harddiskColumns"
                :data-source="info.hardwareInfo.diskList"
                width="80%"
                :pagination="false"
                size="small"
                bordered>
              </a-table>
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item label="内存" :span="2">
            <a-space direction="vertical">
              <div>合计(G)：{{ info.hardwareInfo.memoryTotal }}</div>
              <a-table
                rowKey="no"
                :columns="memoryColumns"
                :data-source="info.hardwareInfo.memoryList"
                width="80%"
                :pagination="false"
                size="small"
                bordered>
              </a-table>
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item label="MAC地址" :span="2">
            <a-space direction="vertical">
              <a-table
                rowKey="no"
                :columns="macColumns"
                :data-source="info.hardwareInfo.mac"
                width="80%"
                :pagination="false"
                size="small"
                bordered>
              </a-table>
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item label="设备类型">
            {{ info.hardwareInfo.deviceType }}
          </a-descriptions-item>
          <a-descriptions-item label="raid卡型号">
            {{ info.hardwareInfo.raidModel }}
          </a-descriptions-item>
          <a-descriptions-item label="数据网卡">
            {{ info.hardwareInfo.networkCard }}
          </a-descriptions-item>
          <a-descriptions-item label="服务器SN号">
            {{ info.hardwareInfo.snNo }}
          </a-descriptions-item>
        </a-descriptions>
      </a-timeline-item>
      <!-- 网络信息 -->
      <a-timeline-item>
        <div>网络信息</div>
        <a-descriptions title=" " size="small" :column="2" bordered>
          <a-descriptions-item label="上报带宽" :span="2">
            <a-space direction="vertical">
              <a-row>
                <a-col :span="4">
                  总数量：{{ info.networkInfo.reportBandwidth[0].lineNumber + info.networkInfo.reportBandwidth[1].lineNumber }}
                </a-col>
                <a-col :span="4">
                  总计(G)：68632
                </a-col>
              </a-row>
              <a-table
                rowKey="type"
                :columns="bindWidthColumns"
                :data-source="info.networkInfo.reportBandwidth"
                width="80%"
                :pagination="false"
                size="small"
                bordered>
              </a-table>
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item label="实际带宽">
            {{ info.networkInfo.actualBandwidth }}
          </a-descriptions-item>
          <a-descriptions-item label="公网/内网">
            {{ info.networkInfo.networkModel == 0 ? '内网' : '公网' }}
          </a-descriptions-item>
          <a-descriptions-item label="NAT类型">
            {{ info.networkInfo.natType }}
          </a-descriptions-item>
          <a-descriptions-item label="网络类型">
            {{ networkTypeMap[info.networkInfo.networkType] }}
          </a-descriptions-item>
          <a-descriptions-item label="网络配置结果">
            {{ info.networkInfo.networkConfig }}
          </a-descriptions-item>
          <a-descriptions-item label="是否IDC节点">
            {{ isIdcMap[info.networkInfo.isIdc] }}
          </a-descriptions-item>
        </a-descriptions>
      </a-timeline-item>
    </a-timeline>
  </a-drawer>
</template>
<script>
import { getHostDetail } from '@/api/assets'
import { accessInfoLabel, isIdcMap, ispMap, deploymentTypeMap, networkTypeMap,
  harddiskColumns, memoryColumns, macColumns, bindWidthColumns } from './hostColumns'

const mapObj = {
  isp: ispMap,
  deploymentType: deploymentTypeMap,
  status: ['招募', '托管'],
  hasUps: ['否', '是']
}

export default {
  props: {
      visible: {
          type: Boolean,
          required: true
      },
      model: {
        type: Object,
        default: () => null
      }
  },
  data () {
    this.labelList = accessInfoLabel
    this.mapObj = mapObj
    this.isIdcMap = isIdcMap
    this.networkTypeMap = networkTypeMap
    this.harddiskColumns = harddiskColumns
    this.memoryColumns = memoryColumns
    this.macColumns = macColumns
    this.bindWidthColumns = bindWidthColumns
    return {
      info: ''
    }
  },
  created () {
    getHostDetail().then(res => {
      this.info = res.result
    })
  }
}
</script>
<style>
  .ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-label{
    word-break: keep-all !important
  }
</style>
