<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 编辑 -->
        <template v-if="model && model.name">
          <a-form-item label="节点名">
            <a-input v-decorator="['name']" disabled />
          </a-form-item>
          <a-form-item label="节点ID">
            <a-input v-decorator="['nodeId']" disabled />
          </a-form-item>
          <a-form-item label="流程状态">
            <a-select v-decorator="['processStatus', {rules: [{required: true}]}]">
              <a-select-option v-for="(item, index) in processStatusMap" :key="index" :value="index">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <!-- 新建 -->
        <template v-else>
          <a-form-item label="主机ID">
            <a-input v-decorator="['hostId', {rules: [{required: true}]}]"/>
          </a-form-item>
          <a-form-item label="是否IDC">
            <a-select v-decorator="['isIdc', {rules: [{required: true}]}]">
              <a-select-option v-for="(item, index) in isIdcMap" :key="index" :value="index">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="部署方式">
            <a-select v-decorator="['deploymentType', {rules: [{required: true}]}]">
              <a-select-option v-for="(item, index) in deploymentTypeMap" :key="index" :value="index">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="网络类型">
            <a-select v-decorator="['networkType', {rules: [{required: true}]}]">
              <a-select-option v-for="(item, index) in networkTypeMap" :key="index" :value="index">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <!-- 编辑/新建 公共部分 -->
        <a-form-item label="上报带宽">
          <a-input v-decorator="['reportBandwidth', {rules: [{required: true}]}]" />
        </a-form-item>
        <a-form-item label="计费状态">
          <a-input v-decorator="['feeStatus', {rules: [{required: true}]}]" />
        </a-form-item>
        <a-form-item label="计费规则">
          <a-select v-decorator="['feeRules', {rules: [{required: true}]}]">
            <a-select-option v-for="(item, index) in feeRulesMap" :key="index" :value="index">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="价格模式">
          <a-input v-decorator="['priceModel', {rules: [{required: true}]}]" />
        </a-form-item>
        <a-form-item label="结算周期">
          <a-select v-decorator="['billingCycle', {rules: [{required: true}]}]">
            <a-select-option v-for="(item, index) in billingCycleMap" :key="index" :value="index">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="!model || !model.name" label="供应商">
          <a-input v-decorator="['supplier', {rules: [{required: true}]}]" />
        </a-form-item>
        <a-form-item label="对接人">
          <a-input v-decorator="['butt', {rules: [{required: true}]}]" />
        </a-form-item>
        <a-form-item v-if="!model || !model.name" label="客户ID">
          <a-input v-decorator="['customerId', {rules: [{required: true}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { processStatusMap, feeRulesMap, billingCycleMap,
    isIdcMap, deploymentTypeMap, networkTypeMap } from './hostColumns'
  // 编辑的表单数据项
  const fieldsEdit = ['name', 'nodeId', 'processStatus', 'reportBandwidth', 'feeStatus', 'feeRules', 'priceModel', 'billingCycle', 'butt']
  // 添加的表单数据项
  const fieldsAdd = ['hostId', 'isIdc', 'deploymentType', 'networkType', 'reportBandwidth', 'feeStatus', 'feeRules', 'priceModel', 'billingCycle', 'butt', 'supplier', 'customerId']

  export default {
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      loading: {
        type: Boolean,
        default: () => false
      },
      model: {
        type: Object,
        default: () => null
      }
    },
    data () {
      this.processStatusMap = processStatusMap
      this.feeRulesMap = feeRulesMap
      this.billingCycleMap = billingCycleMap
      this.isIdcMap = isIdcMap
      this.deploymentTypeMap = deploymentTypeMap
      this.networkTypeMap = networkTypeMap
      this.formLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        }
      }
      return {
        form: this.$form.createForm(this)
      }
    },
    watch: {
      model (value, oldvalue) {
        if ((value.name && oldvalue && oldvalue.name) || (!value.name && (oldvalue && !oldvalue.name))) {
          this.model && this.form.setFieldsValue(pick(this.model, fieldsEdit))
        } else if (value.name) {
          fieldsEdit.forEach(v => this.form.getFieldDecorator(v))
          this.model && this.form.setFieldsValue(pick(this.model, fieldsEdit))
        } else {
          fieldsAdd.forEach(v => this.form.getFieldDecorator(v))
        }
      }
    },
    computed: {
      title () {
        return this.model && this.model.nodeId ? '配置主机' : '新建主机'
      }
    }
  }
</script>
