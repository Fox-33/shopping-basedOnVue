<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 添加分类区域 -->
            <el-button class="btn" @click="showAddDialog" type="primary">添加分类</el-button>
                        <!-- 添加商品分类对话框 -->
            <el-dialog
                title="编辑商品"
                :visible.sync="addDialogVisible"
                width="40%"
                @close="addHandleClose('addFormRef')">
                <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="addForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类" prop="cat_name">
                        <el-cascader
                            v-model="currentClass"
                            :options="goodClassOptions">
                        </el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addHandle('addFormRef')">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 商品分类列表区域 -->
            <zk-table
                ref="table"
                :data="goodCatList"
                :columns="columns"
                :stripe="props.stripe"
                :border="props.border"
                :show-header="props.showHeader"
                :show-summary="props.showSummary"
                :show-row-hover="props.showRowHover"
                :show-index="props.showIndex"
                :tree-type="props.treeType"
                :is-fold="props.isFold"
                :expand-type="props.expandType"
                :selection-type="props.selectionType"
                sum-text="sum"
                index-text="#">
                <template slot="catDeleted" slot-scope="scope">
                    <i v-if="scope.row.cat_deleted" class="el-icon-error"></i>
                    <i v-else class="el-icon-success"></i>
                </template>
                <template slot="catLevel" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level == 0" size="mini">一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level == 1" type="success" size="mini">二级</el-tag>
                    <el-tag v-else type="warning" size="mini">三级</el-tag>
                </template>
                <template slot="option" slot-scope="scope">
                    <!-- 编辑按钮 -->
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                        <el-button @click="showEditDialog(scope.row.cat_id)" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    </el-tooltip>
                    <!-- 删除按钮 -->
                    <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                        <el-button @click="showDeleteDialog(scope.row.cat_id)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                    </el-tooltip>
                </template>
            </zk-table>
            <!-- 编辑商品分类对话框 -->
            <el-dialog
                title="编辑商品"
                :visible.sync="editDialogVisible"
                width="40%"
                @close="editHandleClose('editFormRef')">
                <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="editForm.cat_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editHandle('editFormRef')">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 分页栏区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
  name: 'Rights',
  data () {
      return {
        //   获取商品列表的参数对象
        queryInfo: {
            query: '',
            pagenum: 1,
            pagesize: 10
        },
        // 商品分类列表
        goodCatList: [],
        // 商品分类[一级]总数
        total: 0,
        props: {stripe: false,
                border: true,
                showHeader: true,
                showSummary: false,
                showRowHover: true,
                showIndex: true,
                treeType: true,
                isFold: true,
                expandType: false,
                selectionType: false},
        columns:  [{label: '分类名称',
                    prop: 'cat_name'},
                   {label: '是否有效',
                    prop: 'cat_deleted',
                    type: 'template',
                    template: 'catDeleted'},
                   {label: '排序',
                    prop: 'cat_level',
                    type: 'template',
                    template: 'catLevel'},
                   {label: '操作',
                    type: 'template',
                    template: 'option'}],
        defaultProps:  {children: 'children',
                        label: 'label'},
        editDialogVisible: false,
        editForm: {
            cat_id: Number,
            cat_name: ''
        },
        editFormRules: {
            cat_name: [
                { required: true, message: '请输入分类名称', trigger: 'blur' }
            ],
        },
        addDialogVisible: false,
        addForm: {
            cat_pid: 0,
            cat_name: '',
            cat_level: 0
        },
        addFormRules: {
            cat_name: [
                { required: true, message: '请输入分类名称', trigger: 'blur' }
            ],
        },
        currentClass: '',
        goodClassOptions: [],
      }
  },
  created () {
      this.getGoodCatList()
      this.getGoodClass()
  },
  methods: {
    // 获取商品分类列表
    async getGoodCatList () {
        const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
        if(res.meta.status !== 200) return this.$message.error('商品分类数据列表失败！')
        this.goodCatList = res.data.result
        this.total = res.data.total
        console.log(this.goodCatList)
    },
    //   获取商品分类
    async getGoodClass () {
        const {data: res} = await this.$http.get('categories')
        if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')
        this.goodClass = res.data
        this.goodClass.forEach(val0 => {
            var val0_children = []
            val0.children.forEach(val1 => {
                val0_children.push({
                    value: val1.cat_id,
                    label: val1.cat_name,
                })
            })
            this.goodClassOptions.push({
                value: val0.cat_id,
                label: val0.cat_name,
                children: val0_children
            })
        })
    },
    //   改变 pagesize
    handleSizeChange(val) {
        this.queryInfo.pagesize = val
        this.getGoodCatList()
    },
    //   改变 当前页
    handleCurrentChange(val) {
        this.queryInfo.pagenum = val
        this.getGoodCatList()
    },
    // 显示编辑商品分类对话框
    async showEditDialog (id) {
        const {data: res} = await this.$http.get(`categories/${id}`)
        if(res.meta.status !== 200) return this.$message.error("获取商品分类失败")
        this.editForm.cat_id = res.data.cat_id
        this.editForm.cat_name = res.data.cat_name
        this.editDialogVisible = true
    },
    // 提交商品分类修改数据
    editHandle (formName) {
        this.$refs[formName].validate(async valid => {
            if(!valid) return;
            const {data: res} = await this.$http.put(`categories/${this.editForm.cat_id}`, {cat_name: this.editForm.cat_name})
            if(res.meta.status !== 200) return this.$message.error("修改商品分类失败")
            this.editDialogVisible = false
            this.getGoodCatList()
        })
    },
    // 取消商品分类修改处理
    editHandleClose (formName) {
        this.editDialogVisible = false
        this.$refs[formName].resetFields();
    },
    //   显示删除该商品分类对话框
    async showDeleteDialog (id) {
        const result = await this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if( result == 'confirm'){
            const {data: res} = await this.$http.delete(`categories/${id}`)
            if(res.meta.status !== 200)   return this.$message.error('编辑商品分类失败!');
            this.$message.success('编辑商品分类成功');
            this.getGoodCatList()
        }
    },
    // 显示添加商品分类对话框
    showAddDialog () {
        this.addDialogVisible = true
    },
    // 提交新建商品分类数据
    addHandle (formName) {
        this.$refs[formName].validate(async valid => {
            if(!valid) return;
            console.log(this.addForm)
            console.log(this.currentClass)
            if(this.currentClass){
                this.addForm.cat_pid = this.currentClass[this.currentClass.length-1]
                this.addForm.cat_level = this.currentClass.length
            }
            const {data: res} = await this.$http.post('categories', this.addForm)
            console.log(res)
            if(res.meta.status !== 201) return this.$message.error("创建商品分类失败")
            this.$message.success("创建商品分类成功")
            this.getGoodCatList()
            this.addDialogVisible = false
        })
    },
    // 取消创建商品分类处理
    addHandleClose (formName) {
        this.editDialogVisible = false
        this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang='css' scoped>
.btn {
    margin-bottom: 20px;
}
.el-icon-success {
    color: #4F94CD;
}
.el-icon-error {
    color: grey;
}
</style>
