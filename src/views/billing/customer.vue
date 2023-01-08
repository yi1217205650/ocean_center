<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <!-- 头部筛选表单 -->
        <a-form layout="inline">
          <!-- gutter 栅格间隔 -->
          <a-row :gutter="50">
            <div v-for="(item, itemIndex) in searchColumns" :key="item.dataIndex">
              <a-col :md="8" :sm="24" v-show="itemIndex < 2 || advanced">
                <a-form-item :label="item.searchTitle || item.title">
                  <!-- 下拉选择器 -->
                  <a-select v-if="item.searchType == 2" v-model="queryParam[item.dataIndex]" placeholder="">
                    <a-select-option v-for="(value, index) in item.searchMap" :key="index" :value="index">
                      <span>{{ value }}</span>
                    </a-select-option>
                  </a-select>
                  <!-- 输入框 -->
                  <a-input v-else v-model="queryParam[item.dataIndex]" placeholder="" />
                </a-form-item>
              </a-col>
            </div>
            <!-- 筛选操作按钮 -->
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="queryTable">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 主机表格 -->
      <s-table
        ref="table"
        size="small"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
        bordered
        column.ellipsis
      >
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { STable } from '@/components'
import { getHostList } from '@/api/assets'
import { CustomerColumns } from './modules'

// 搜索项
const searchColumns = CustomerColumns.filter((item, index) => {
  return item.searchType
})

export default {
  name: 'Host',
  components: {
    STable
  },
  data () {
    this.columns = CustomerColumns // 表头
    this.searchColumns = searchColumns // 搜索项
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getHostList(requestParameters).then((res) => {
          return res
        })
      }
    }
  },
  methods: {
    // 显式/隐藏 筛选其他条件
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 查询
    queryTable () {
      this.$refs.table.refresh()
    }
  }
}
</script>
