<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <!-- 头部筛选表单 -->
        <a-form layout="inline">
          <!-- gutter 栅格间隔 -->
          <a-row :gutter="50">
            <div v-for="(item, itemIndex) in searchColumns" :key="item.dataIndex">
              <a-col :md="6" :sm="24" v-show="itemIndex < 3 || advanced">
                <a-form-item :label="item.searchTitle || item.title">
                  <!-- 下拉选择器 -->
                  <a-select v-if="item.searchType == 1" v-model="queryParam[item.dataIndex]" placeholder="">
                    <a-select-option v-for="(value, index) in item.searchMap.length > 0 ? item.searchMap : 2" :key="index" :value="index">
                      <span v-if="item.searchMap.length > 0">{{ value }}</span>
                      <span v-else>{{ item.title + '--' +value }}</span>
                    </a-select-option>
                  </a-select>
                  <!-- 时间选择器 -->
                  <a-date-picker v-else-if="item.searchType == 2" v-model="queryParam[item.dataIndex]" style="width: 100%" placeholder=""/>
                  <!-- 输入框 -->
                  <a-input v-else v-model="queryParam[item.dataIndex]" placeholder="" />
                </a-form-item>
              </a-col>
            </div>
            <!-- 筛选操作按钮 -->
            <a-col :md="(!advanced && 6) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}">
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
      <!-- 新建/多选操作 -->
      <div class="table-operator">
        <a-button v-action:add type="primary" icon="plus" @click="handleAddOrEdit">新建</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="itemsOperate(0)" ><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2" @click="itemsOperate(1)"><a-icon type="vertical-align-top" />上机</a-menu-item>
            <a-menu-item key="3" @click="itemsOperate(2)"><a-icon type="vertical-align-bottom" />下机</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
      </div>
      <!-- 主机表格 -->
      <s-table
        ref="table"
        size="small"
        rowKey="no"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
        bordered
        column.ellipsis
        :scroll="{ x: 2000,y: 500 }" >
        <!-- 通过插槽修改每列的样式 -->
        <span v-for="item in slotsList" :key="item.dataIndex" :slot="item.dataIndex" slot-scope="text">
          <span :class="[item.dataIndex == 'evaluationRes' ? 'status-color' + text : '',item.dataIndex == 'networkStatus' ? 'underline-text'+ ' status-color' + text : '']">
            {{ item.searchMap[text] }}
          </span>
        </span>
        <!-- 操作 -->
        <span slot="action" slot-scope="text, record">
          <template>
            <a v-action:edit @click="handleAddOrEdit(record)">配置</a>
            <a-divider v-action:edit type="vertical" />
            <a @click="handleToggleDetail(record)">详情</a>
          </template>
        </span>
      </s-table>
      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk" />
      <!-- 机器详情 -->
      <HostDetailDrawer
        :visible="detailVisible"
        :model="detailInfo"
        @drawClose="handleToggleDetail(null)" >
      </HostDetailDrawer>
    </a-card>
  </page-header-wrapper>
</template>
<script>
  import { STable } from '@/components'
  import { getHostList, editHost, operHost } from '@/api/assets'
  import { CreateForm, HostDetailDrawer } from './modules'
  import { columns } from './modules/hostColumns'
  // 搜索项
  const searchColumns = columns.filter((item, index) => {
    return index !== columns.length - 1
  })
  searchColumns.forEach((item, index) => {
    if (item.children && item.children.length > 0) {
      searchColumns.splice(index, 1, ...item.children)
    }
  })
  // 自定义表格的插槽
  const slotsList = searchColumns.filter(item => {
    return item.scopedSlots
  })

  export default {
    name: 'TableList',
    components: {
      STable,
      CreateForm,
      HostDetailDrawer
    },
    data () {
      this.columns = columns // 表头
      this.searchColumns = searchColumns // 搜索项
      this.slotsList = slotsList // 表格自定义插槽列表
      return {
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          return getHostList(requestParameters)
            .then(res => {
              return res.result
            })
        },
        // 选中的列和key
        selectedRowKeys: [],
        selectedRows: [],
        // 新建/配置弹窗
        visible: false,
        confirmLoading: false,
        mdl: null, // 传递信息
        // 主机详情
        detailVisible: false,
        detailInfo: null
      }
    },
    computed: {
      // 表格选中的列
      rowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    methods: {
      // 新建或配置
      handleAddOrEdit (record) {
        this.visible = true
        this.mdl = record ? { ...record } : null
      },
      // 详细信息
      handleToggleDetail (record) {
        this.detailInfo = record ? { ...record } : null
        this.detailVisible = !!record
      },
      // 新建/配置表单提交
      handleOk () {
        const form = this.$refs.createModal.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            editHost(values).then(res => {
              if (res.result.status) {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()
                this.$message.success(values.name ? '修改成功' : '新增成功')
              } else {
                this.confirmLoading = false
                this.$message.error(values.name ? '修改失败' : '新增失败')
              }
            })
          } else {
            this.confirmLoading = false
            this.$message.error(values.name ? '修改失败' : '新增失败')
          }
        })
      },
      // 新建/配置表单取消
      handleCancel () {
        this.visible = false
        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      // 表格多选
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      // 显式/隐藏 筛选其他条件
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      // 查询
      queryTable () {
        // 时间需要格式化再传 不然是moment对象
        // this.queryParam.onlineTime.format('YYYY-MM-DD')
        // this.queryParam.upTime.format('YYYY-MM-DD')
        // this.queryParam.downTime.format('YYYY-MM-DD')
        console.log(this.queryParam)
        this.$refs.table.refresh()
      },
      // 删除/上机/下机
      itemsOperate (type) {
        const operMap = ['删除', '上机', '下机']
        this.$message.loading(`正在批量${operMap[type]}...`, 1)
        operHost({
          type: type,
          items: this.selectedRowKeys.join(',')
        }).then(res => {
          if (res.result.status) {
            this.$refs.table.clearSelected()
            // 刷新表格
            this.$refs.table.refresh()
            this.$message.success(`${operMap[type]}成功`)
          } else {
            this.$message.error(`${operMap[type]}失败`)
          }
        })
      }
    }
  }
</script>
<style>
  .status-color0{
    color: red;
  }
  .status-color1{
    color: green;
  }
  .underline-text{
    text-decoration: underline;
  }
</style>
