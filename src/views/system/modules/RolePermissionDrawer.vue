<template>
  <a-drawer
    placement="right"
    :maskClosable="false"
    :visible="roleVisible"
    @close="$emit('drawClose')"
    width="60%"
    title="菜单权限设置"
  >
    <a-table
      :style="{ marginBottom: '50px' }"
      :columns="columns"
      :data-source="menuListTree"
      rowKey="page"
      :pagination="false"
      bordered
    >
      <span slot="page" slot-scope="text, record">
        <template>
          <a-checkbox :checked="record.checked == 1" @change="onCheckBoxChange(record,$event)">
            {{ text }}
          </a-checkbox>
        </template>
      </span>
      <span slot="actions" slot-scope="text">
        <template>
          <a-row>
            <a-col :span="8" v-for="(item, index) in text" :key="index">
              <a-checkbox :checked="item.checked" @change="onActionCheck(item,$event)">
                {{ item.name }}
              </a-checkbox>
            </a-col>
          </a-row>
        </template>
      </span>
    </a-table>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button :style="{ marginRight: '8px' }" @click="$emit('drawClose')">
        取消
      </a-button>
      <a-button type="primary" @click="onhandleSubmit">
        确定
      </a-button>
    </div>
  </a-drawer>
</template>
<script>
  const columns = [
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
      // width: '120px'
    },
    {
      title: '功能',
      dataIndex: 'actions',
      scopedSlots: { customRender: 'actions' }
    }
  ]
  export default {
    props: {
        roleVisible: {
            type: Boolean,
            required: true
        },
        model: {
          type: Object,
          default: () => null
        },
        menuList: {
          type: Array,
          default: () => []
        },
        menuListTree: {
          type: Array,
          default: () => []
        }
    },
    data () {
      this.columns = columns
      return {
        selectMenuId: []
      }
    },
    created () {
      // 当 model 发生改变时，为表单设置值
      this.$watch('model', () => {
        if (this.model && this.model.menus.length > 0) {
          // 遍历出用户有的所有菜单
          this.model.menus.forEach(item => {
            this.selectMenuId.push(item.id)
          })
          // 角色拥有的菜单和全部菜单匹配
          this.menuListTree.forEach(item => {
            item.checked = this.selectMenuId.indexOf(item.id) !== -1
          })
          console.log(this.menuList)
          console.log(this.menuListTree)
        }
      })
    },
    methods: {
      onCheckBoxChange (record, event) {
        const checked = event.target.checked ? 1 : 0
        console.log(checked, record)
      },
      // action处理
      onActionCheck (record, event) {
        const checked = event.target.checked ? 1 : 0
        record.checked = checked
      },
      onhandleSubmit () {
        console.log(this.selectMenuId)
        console.log('提交修改')
      }
    }
  }
</script>
