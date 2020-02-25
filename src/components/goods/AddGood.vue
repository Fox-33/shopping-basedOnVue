<template>
    <div >
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <el-alert
                title="添加商品信息"
                type="info"
                center
                :closable="false"
                show-icon>
            </el-alert>
            <!-- 步骤条 -->
            <el-steps :active="active" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form ref="addGoodFormRef" :model="addGoodForm" :rules="addGoodFormRules" label-width="80px" label-position="top">
                <el-tabs tab-position="left" :before-leave="changeTab">
                    <el-tab-pane label="基本信息">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addGoodForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addGoodForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addGoodForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="currentClass"
                                :options="goodClassOptions"
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数">
                        <div class="manyAttr" :key='item.attr_id' v-for='item in manyAttrs'>
                            <el-row>
                                {{ item.attr_name }}
                            </el-row>
                            <el-row>
                                <el-checkbox @change="choseVal(item.attr_id, val, $event)" checked :key="index" v-for="(val, index) in item.attr_vals" :label="val" border></el-checkbox>
                            </el-row>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性">
                        <el-form-item :key="item.attr_id" v-for="item in onlyAttrs" :label="item.attr_name">
                            <el-input v-model="item.attr_vals" ></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片">
                        <el-upload
                            class="upload-demo"
                            action=""
                            :file-list="imgList"
                            list-type="picture"
                            :auto-upload="false">
                        <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容">
                        <quill-editor 
                            v-model="addGoodForm.goods_introduce"
                            class="editor"
                            ref="quillEditor"
                            @blur="onEditorBlur($event)">
                        </quill-editor>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
  name: 'AddGood',
  data () {
      return {
          active: 0,
          addGoodForm: {
              goods_name: '',
              goods_cat: '',
              goods_price: '',
              goods_number: '',
              goods_weight: '',
              goods_introduce: '',
              pics: {},
              attrs: []
          },
          addGoodFormRules: {
            goods_name: [
                { required: true, message: '请输入商品名称', trigger: 'blur' },
            ],
            goods_price: [
                { required: true, message: '请输入商品价格', trigger: 'blur' },
            ],
            goods_weight: [
                { required: true, message: '请输入商品重量', trigger: 'blur' },
            ],
            goods_number: [
                { required: true, message: '请输入商品数量', trigger: 'blur' },
            ],
            goods_cat: [
                { required: true, message: '请输入商品分类', trigger: 'blur' },
            ],
          },
          currentClass: '',
          goodClass: [],
          goodClassOptions: [],
        //   动态参数
          manyAttrs: [],
        //   静态参数
          onlyAttrs: [],
          imgList: [],
      }
  },
  created () {
      this.getGoodClass()
  },
  methods: {
    //   获取商品分类
      async getGoodClass () {
          const {data: res} = await this.$http.get('categories')
          if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')
          this.goodClass = res.data
          this.goodClass.forEach(val0 => {
              var val0_children = []
              val0.children.forEach(val1 => {
                  if(val1.children){
                  var val1_children = []
                    val1.children.forEach(val2 => {
                        val1_children.push({
                            value: val2.cat_id,
                            label: val2.cat_name
                        })
                    })
                    val0_children.push({
                      value: val1.cat_id,
                      label: val1.cat_name,
                      children: val1_children
                    })
                  }
                  else{
                    val0_children.push({
                      value: val1.cat_id,
                      label: val1.cat_name,
                    })
                  }
              })
              this.goodClassOptions.push({
                  value: val0.cat_id,
                  label: val0.cat_name,
                  children: val0_children
              })
          })
      },
    //   选取商品分类 -> 根据商品分类获取参数
      async handleChange () {
          this.addGoodForm.goods_cat = this.currentClass.join(',')
          var id = this.currentClass[this.currentClass.length-1]
        //   获取动态参数——[商品参数]
          const {data: res_many} = await this.$http.get(`categories/${id}/attributes`, { params:  {sel: "many"} })
          if(res_many.meta.status !== 200) return this.$message.error('请求动态参数失败')
          this.manyAttrs = res_many.data
        //   console.log(res_many.data)
          this.manyAttrs.forEach(val => {
              val.attr_vals = val.attr_vals.split(',')
              val.attr_vals.forEach(attr_value => {
                this.addGoodForm.attrs.push({
                    attr_id: val.attr_id,
                    attr_value: attr_value
                })
              })
          })
        //   console.log(this.addGoodForm.attrs)

        //   获取静态参数——[商品属性]
          const {data: res_only} = await this.$http.get(`categories/${id}/attributes`, { params:  {sel: "only"} })
          if(res_only.meta.status !== 200) return this.$message.error('请求静态参数失败')
          this.onlyAttrs = res_only.data
      },
    //   选择动态参数
      choseVal (attr_id, attr_value, isCheck) {
          if(isCheck){
              this.addGoodForm.attrs.push({
                  attr_id: attr_id,
                  attr_value: attr_value
              })
          }else{
              var index = this.addGoodForm.attrs.findIndex(val => {
                  return val.attr_value = attr_value
              })
              this.addGoodForm.attrs.splice(index, 1)
          }
      },
    //   改变 Tab
      changeTab (activeName, oldActiveName) {
          if(activeName != 0){
            var result = true
            this.$refs['addGoodFormRef'].validate(valid => {
                if(valid) this.active = parseInt(activeName)
                result = valid
            })
            return result
          }
      },
    //   编辑栏失去焦点 => 商品内容编辑完成
      async onEditorBlur () {
          this.active = 5
          const result = await this.$confirm('此操作将提交该新商品, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).catch(err => err)
          if( result == 'confirm'){
              this.addGoodForm.pics = this.imgList
              this.onlyAttrs.forEach(attr => {
                this.addGoodForm.attrs.push({
                    attr_id: attr.attr_id,
                    attr_value: attr.attr_vals
                })
              })
            //   提交添加商品请求
              const {data: res} = await this.$http.post('goods', this.addGoodForm);
            //   失败 => 提示消息并停留在新商品内容编辑页面
              if(res.meta.status !== 201)   return this.$message.error('添加商品失败!');
            //   成功 => 返回商品列表
              this.$message.success('添加商品成功');
              this.$router.push('/goods'); 
          }
      }
  }
}
</script>

<style lang='css' scoped>
.el-tag {
    width: 100%;
    text-align: center;
}
.el-steps {
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 90%;
}
.manyAttr {
    margin: 10px
}
.el-checkbox {
    margin: 10px;
}
</style>
