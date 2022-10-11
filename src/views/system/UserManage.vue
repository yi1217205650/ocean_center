<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <div v-for="(item, itemIndex) in searchColumns" :key="item.dataIndex">
            <a-col :md="8" :sm="24" v-show="itemIndex < 2 || advanced">
              <a-form-item :label="item.title">
                <!-- 下拉选择器 -->
                <a-select v-if="item.searchType == 1" v-model="queryParam[item.dataIndex]" placeholder="">
                  <a-select-option v-for="(value, index) in item.searchMap" :key="index" :value="index">
                    <span>{{ item.dataIndex == 'role' ? value.text : value }}</span>
                  </a-select-option>
                </a-select>
                <!-- 时间选择器 -->
                <a-date-picker v-else-if="item.searchType == 2" v-model="queryParam[item.dataIndex]" style="width: 100%" placeholder=""/>
                <!-- 输入框 -->
                <a-input v-else v-model="queryParam[item.dataIndex]" placeholder="" />
              </a-form-item>
            </a-col>
          </div>
          <a-col :md="!advanced && 6 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAddOrEdit()">添加用户</a-button>
      <!-- 选中用户后显式批量操作 -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="handleItemOper(0)"><a-icon type="delete" />删除</a-menu-item>
          <a-menu-item key="2" @click="handleItemOper(1)"><a-icon type="unlock" />启用</a-menu-item>
          <a-menu-item key="3" @click="handleItemOper(2)"><a-icon type="lock" />禁用</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /> </a-button>
      </a-dropdown>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowSelection="rowSelection"
      showPagination="auto"
      bordered
    >
      <!-- 通过插槽修改每列的样式 -->
      <span slot="userName" slot-scope="text, record">
        <template>
          <a-space>
            <a-avatar v-if="record.avatar" size="small" :src="record.avatar" />
            <span>{{ text }}</span>
          </a-space>
        </template>
      </span>
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="roles" slot-scope="text">
        <a-tag color="blue" v-for="item in text" :key="item.id">
          {{ item.name }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleAddOrEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleItemOper(record.status+1, record)">{{ record.status ? '禁用' : '启用' }}</a>
          <a-divider type="vertical" />
          <a @click="handleItemOper(0, record)" class="color-red">删除</a>
        </template>
      </span>
    </s-table>

    <user-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>
<script>
  import moment from 'moment'
  import { STable, Ellipsis } from '@/components'
  import UserForm from './modules/UserForm'
  import { getUserList, addUser } from '@/api/system'
  import { userColumns } from './modules/columnsData'
  import { Modal } from 'ant-design-vue'
  // 搜索项
  const searchColumns = userColumns.filter((item, index) => {
    return index !== userColumns.length - 1
  })
  const operMap = ['删除', '启用', '禁用']

  export default {
    name: 'UserManage',
    components: {
      STable,
      Ellipsis,
      UserForm
    },
    data () {
      this.columns = userColumns
      this.searchColumns = searchColumns
      return {
        // create model
        visible: false,
        confirmLoading: false,
        mdl: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          const requestParameters = Object.assign({}, parameter, this.queryParam)
          console.log('loadData request parameters:', requestParameters)
          return getUserList(requestParameters)
            .then(res => {
              // res.pageNo = 1
              // res.totalCount = 50
              return res
            })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    filters: {
      statusFilter (type) {
        return type ? '正常' : '异常'
      },
      statusTypeFilter (type) {
        return type ? 'success' : 'error'
      }
    },
    computed: {
      rowSelection () {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    methods: {
      // 用户操作
      handleItemOper (type, record) {
        // type 0-删除  1-启用  2-禁用
        const user = !record ? '选中用户' : `用户“${record.userName}”`
        Modal.confirm({
          title: `${operMap[type]}提示`,
          content: `确定${operMap[type]}${user}吗？`,
          onOk: () => {
            this.$message.info(`${operMap[type]}成功`)
          },
          onCancel () {}
        })
      },
      // 添加或编辑用户
      handleAddOrEdit (mdl = null) {
        this.mdl = mdl
        this.visible = true
      },
      // 添加或编辑点击确认
      handleOk () {
        const form = this.$refs.createModal.form
        this.confirmLoading = true
        form.validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
            addUser(values).then(res => {
              console.log(res)
            })
            // new Promise((resolve, reject) => {
            //   setTimeout(() => {
            //     resolve()
            //   }, 1000)
            // }).then(res => {
            //   this.visible = false
            //   this.confirmLoading = false
            //   // 重置表单数据
            //   form.resetFields()
            //   // 刷新表格
            //   this.$refs.table.refresh()

            //   this.$message.success(values.uid ? '修改成功' : '新增成功')
            // })
          } else {
            this.confirmLoading = false
          }
        })
      },
      // 添加或删除点击取消
      handleCancel () {
        this.visible = false
        const form = this.$refs.createModal.form
        form.resetFields() // 清理表单数据（可不做）
      },
      // 选中数据
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      // 显示隐藏其他搜索项
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      handleSearch () {
        // 时间需要格式化再传 不然是moment对象
        if (this.queryParam.time) {
          this.queryParam.time = this.queryParam.time.format('YYYY-MM-DD')
        }
        console.log(this.queryParam)
        this.$refs.table.refresh()
      },
      // 重置搜索表单
      resetSearchForm () {
        this.queryParam = {
          date: moment(new Date())
        }
      }
    }
  }
</script>
<style>
  .color-red{
    color: red
  }
</style>
