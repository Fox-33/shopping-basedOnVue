<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                :closable="false"
                show-icon>
            </el-alert>
            <div class="chooseCat">
                请选择商品分类：
                <el-cascader
                    v-model="currentClass"
                    :options="goodClassOptions"
                    @change="handleChange">
                </el-cascader>
            </div>
            <el-tabs>
                <el-tab-pane label="动态参数">
                    <!-- 添加参数按钮 -->
                    <el-button @click="showAddManyDialog()" :disabled="isBtnAble" type="primary">添加参数</el-button>
                    <!-- 添加参数对话框 -->
                    <el-dialog
                        title="添加动态参数"
                        :visible.sync="addManyDialogVisible"
                        width="40%"
                        @close="addHandleClose('addParamFormRef','many')">
                        <el-form ref="addParamFormRef" :model="editParamForm" :rules="editFormRules" label-width="80px">
                            <el-form-item label="动态参数" prop="attr_name">
                                <el-input v-model="editParamForm.attr_name"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="addManyDialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="addParamHandle('addParamFormRef', 'many')">确 定</el-button>
                        </span>
                    </el-dialog>
                    <!-- 动态参数列表区域 -->
                    <el-table ref="manyAttrsTableRef" :data="manyAttrs" stripe border style="width: 100%">
                        <el-table-column type="expand" >
                            <template slot-scope="scope" >
                                <el-tag
                                    :key="index"
                                    v-for="(tag, index) in scope.row.attr_vals"
                                    v-if="tag"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose(scope.row, tag)">
                                    {{tag}}
                                </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <!-- 修改按钮 -->
                                <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                                    <el-button @click="showEditDialog(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                                </el-tooltip>
                                <!-- 删除按钮 -->
                                <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                                    <el-button @click="showDeleteDialog(scope.row)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                                </el-tooltip>
                                <!-- 修改动态参数对话框 -->
                                <el-dialog
                                    title="修改动态参数"
                                    :visible.sync="editManyDialogVisible"
                                    width="40%"
                                    @close="editHandleClose('editParamFormRef')">
                                    <el-form ref="editParamFormRef" :model="editParamForm" :rules="editFormRules" label-width="80px">
                                        <el-form-item label="动态参数" prop="attr_name">
                                            <el-input v-model="editParamForm.attr_name"></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="editManyDialogVisible = false">取 消</el-button>
                                        <el-button type="primary" @click="editManyParam">确 定</el-button>
                                    </span>
                                </el-dialog>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性">
                    <!-- 添加参数按钮 -->
                    <el-button @click="showAddOnlyDialog()" :disabled="isBtnAble" type="primary">添加参数</el-button>
                    <!-- 添加参数对话框 -->
                    <el-dialog
                        title="添加静态参数"
                        :visible.sync="addOnlyDialogVisible"
                        width="40%"
                        @close="addHandleClose('addParamFormRef','only')">
                        <el-form ref="addParamFormRef" :model="editParamForm" :rules="editFormRules" label-width="80px">
                            <el-form-item label="静态参数" prop="attr_name">
                                <el-input v-model="editParamForm.attr_name"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="addOnlyDialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="addParamHandle('addParamFormRef','only')">确 定</el-button>
                        </span>
                    </el-dialog>
                    <!-- 静态属性列表区域 -->
                    <el-table ref="onlyAttrsTableRef" :data="onlyAttrs" stripe border style="width: 100%">
                        <el-table-column type="expand" >
                            <template slot-scope="scope" >
                                <el-tag
                                    :key="index"
                                    v-for="(tag, index) in scope.row.attr_vals"
                                    v-if="tag"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose(scope.row, tag)">
                                    {{tag}}
                                </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <!-- {{ scope.row }} -->
                                <!-- 修改按钮 -->
                                <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                                    <el-button @click="showEditDialog(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                                </el-tooltip>
                                <!-- 删除按钮 -->
                                <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                                    <el-button @click="showDeleteDialog(scope.row)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                                </el-tooltip>
                                <!-- 修改静态属性对话框 -->
                                <el-dialog
                                    title="修改静态属性"
                                    :visible.sync="editOnlyDialogVisible"
                                    width="40%"
                                    @close="editHandleClose('editParamFormRef')">
                                    <el-form ref="editParamFormRef" :model="editParamForm" :rules="editFormRules" label-width="80px">
                                        <el-form-item label="静态属性" prop="attr_name">
                                            <el-input v-model="editParamForm.attr_name"></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="editOnlyDialogVisible = false">取 消</el-button>
                                        <el-button type="primary" @click="editOnlyParam">确 定</el-button>
                                    </span>
                                </el-dialog>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'Params',
  data () {
      return {
          currentClass: '',
          goodClass: [],
          goodClassOptions: [],
        //   动态参数
          manyAttrs: [],
        //   静态参数
          onlyAttrs: [],
          inputVisible: false,
          inputValue: '',
          editParams: {},
          editManyDialogVisible: false,
          editOnlyDialogVisible: false,
          editParamForm: {
              attr_id: Number,
              attr_name: ''
          },
          editFormRules: {
              attr_name: [
                { required: true, message: '请输入参数名称', trigger: 'blur' }
              ],
          },
          addManyDialogVisible: false,
          addOnlyDialogVisible: false,
          isBtnAble: true
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
    //   获取动态参数——[商品参数]
      async getManyAttrs (id) {
          const {data: res_many} = await this.$http.get(`categories/${id}/attributes`, { params:  {sel: "many"} })
          if(res_many.meta.status !== 200) return this.$message.error('请求动态参数失败')
          this.manyAttrs = res_many.data
          this.manyAttrs.forEach(val => {
              val.attr_vals = val.attr_vals.split(',')
              this.$set(val, 'inputVisible', false)
              this.$set(val, 'inputValue', '')
          })
      },
    //   获取静态参数——[商品参数]
      async getOnlyAttrs (id) {
          const {data: res_only} = await this.$http.get(`categories/${id}/attributes`, { params:  {sel: "only"} })
          if(res_only.meta.status !== 200) return this.$message.error('请求静态参数失败')
          this.onlyAttrs = res_only.data
          this.onlyAttrs.forEach(val => {
              val.attr_vals = val.attr_vals.split(',')
              this.$set(val, 'inputVisible', false)
              this.$set(val, 'inputValue', '')
          })
      },
    //   选取商品分类 -> 根据商品分类获取参数
      handleChange () {
          if(this.currentClass.length == 3){
              this.isBtnAble = false
              var id = this.currentClass[2]
            //   获取动态参数——[商品参数]
              this.getManyAttrs(id)
            //   获取静态参数——[商品属性]
              this.getOnlyAttrs(id)
          }else{
              this.isBtnAble = true
              this.manyAttrs = []
              this.onlyAttrs = []
          }
      },
    //   点击参数的选项标签的删除按钮 => 删除参数里的选项
      async handleClose(row, tag) {
          var tagindex = row.attr_vals.indexOf(tag)
          var id = row.cat_id
          var attrid = row.attr_id
          row.attr_vals.splice(tagindex,1)
          this.editParams = {attr_name: row.attr_name,
                             attr_sel: row.attr_sel,
                             attr_vals: row.attr_vals.join(',')}
          const {data: res} = await this.$http.put(`categories/${id}/attributes/${attrid}`, this.editParams)
          if(res.meta.status !== 200){
              row.attr_vals.splice(tagindex, 0, tag);
              return this.$message.error("更新失败")
          } 
      },
    //   new Tag 切换至 输入框 状态
      showInput (row) {
        row.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
    //   处理 new Tag 输入的内容 => 添加动态参数里的选项
      async handleInputConfirm (row) {
        let inputValue = row.inputValue;
        if (inputValue) {
          var id = row.cat_id
          var attrid = row.attr_id
          row.attr_vals.push(inputValue)
          this.editParams = {attr_name: row.attr_name,
                             attr_sel: row.attr_sel,
                             attr_vals: row.attr_vals.join(',')}
          const {data: res} = await this.$http.put(`categories/${id}/attributes/${attrid}`, this.editParams)
          if(res.meta.status !== 200){
              row.attr_vals.pop(inputValue);
              return this.$message.error("更新失败")
          } 
        }
        row.inputVisible = false;
        row.inputValue = '';
      },
    //   显示编辑区域
      showEditDialog (row) {
          console.log(row)
          this.editParamForm.attr_name = row.attr_name
          this.editParamForm.attr_id = row.attr_id
          if(row.attr_sel == 'many')    this.editManyDialogVisible = true
          else this.editOnlyDialogVisible = true
      },
    //   提交修改动态参数处理
      editManyParam () {
          var attrid = this.editParamForm.attr_id
          var index = this.manyAttrs.findIndex(val => {
              return val.attr_id = attrid
          })
          var id = this.manyAttrs[index].cat_id
          var attr_sel = this.manyAttrs[index].attr_sel
          var attr_vals = this.manyAttrs[index].attr_vals.join(',')
          this.editParams = {attr_name: this.editParamForm.attr_name,
                             attr_sel: attr_sel,
                             attr_vals: attr_vals}
          this.$refs['editParamFormRef'].validate(async valid => {
              if(!valid) return;
              const {data: res} = await this.$http.put(`categories/${id}/attributes/${attrid}`, this.editParams)
              if(res.meta.status !== 200) return this.$message.error("修改失败")
              this.getManyAttrs(id)
              this.editManyDialogVisible = false
              this.$message.success("修改成功")
          })
      },
    //   提交修改静态属性处理
      editOnlyParam () {
          var attrid = this.editParamForm.attr_id
          var index = this.onlyAttrs.findIndex(val => {
              return val.attr_id = attrid
          })
          var id = this.onlyAttrs[index].cat_id
          var attr_sel = this.onlyAttrs[index].attr_sel
          var attr_vals = this.onlyAttrs[index].attr_vals.join(',')
          this.editParams = {attr_name: this.editParamForm.attr_name,
                             attr_sel: attr_sel,
                             attr_vals: attr_vals}
          this.$refs['editParamFormRef'].validate(async valid => {
              if(!valid) return;
              const {data: res} = await this.$http.put(`categories/${id}/attributes/${attrid}`, this.editParams)
              if(res.meta.status !== 200) return this.$message.error("修改失败")
              this.getOnlyAttrs(id)
              this.editOnlyDialogVisible = false
              this.$message.success("修改成功")
          })
      },
    //   取消修改参数处理
      editHandleClose (formName) {
          this.editManyDialogVisible = false
          this.$refs[formName].resetFields();
      },
    //   显示删除对话框
      async showDeleteDialog (row) {
        const result = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if( result == 'confirm'){
            var id = row.cat_id
            var attrid = row.attr_id
            const {data: res} = await this.$http.delete(`categories/${id}/attributes/${attrid}`);
            if(res.meta.status !== 200)   return this.$message.error('删除参数失败!');
            if(row.attr_sel == 'many')    this.getManyAttrs(id)
            else this.getOnlyAttrs(id)
            this.$message.success('删除参数成功');
        }
      },
    //   显示添加参数对话框
      showAddManyDialog () {
          this.addManyDialogVisible = true
      },
      showAddOnlyDialog () {
          this.addOnlyDialogVisible = true
      },
    //   提交添加参数请求
      addParamHandle (formName, attr_sel) {
          var id = this.currentClass[2]
          this.editParams = {attr_name: this.editParamForm.attr_name,
                             attr_sel: attr_sel,
                             attr_vals: ""}
          this.$refs[formName].validate(async valid => {
              if(!valid) return;
              const {data: res} = await this.$http.post(`categories/${id}/attributes`, this.editParams)
              if(res.meta.status !== 201) return this.$message.error("添加动态参数失败!")
              if(attr_sel == 'many'){
                  this.getManyAttrs(id)
                  this.addManyDialogVisible = false
              }else{
                  this.getOnlyAttrs(id)
                  this.addOnlyDialogVisible = false
              }
              this.$message.success('添加动态参数成功');
          })
      },
    //   取消添加参数处理
      addHandleClose (formName, attr_sel) {
          if(attr_sel == 'many')    this.addManyDialogVisible = false
          else this.addOnlyDialogVisible = false
          this.$refs[formName].resetFields();
      }
  }
}
</script>

<style lang='css' scoped>
.chooseCat {
    margin: 10px 0;
}
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
