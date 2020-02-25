<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <!-- 搜索 -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="clearSearchContent" class="input-with-select">
                        <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <!-- 添加 -->
                <el-col :span="4">
                    <el-button @click="showAddDialog" type="primary">添加用户</el-button>
                </el-col>
                <el-form ref="addUserFormRef" :model="addUserForm" :rules="userFormRules" label-width="80px">
                    <el-dialog
                        title="添加用户"
                        :visible.sync="addDialogVisible"
                        width="40%"
                        @close="addHandleClose('addUserFormRef')">
                        <el-form-item label="用户名称" prop="username">
                            <el-input v-model="addUserForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="用户密码" prop="password">
                            <el-input v-model="addUserForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="addUserForm.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="addUserForm.mobile"></el-input>
                        </el-form-item>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="addDialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="addUser('addUserFormRef')">确 定</el-button>
                        </span>
                    </el-dialog>
                </el-form>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userlist" style="width: 100%" border stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="changeStatus(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="185px">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button @click="showDeleteDialog(scope.row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </el-tooltip>
                        <!-- 分配角色按钮 -->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button @click="showDistributeDialog(scope.row.id)" type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                        <!-- 编辑用户对话框 -->
                        <el-dialog
                            title="编辑用户"
                            :visible.sync="editDialogVisible"
                            width="40%"
                            @close="editHandleClose('editUserFormRef')">
                            <el-form ref="editUserFormRef" :model="editUserForm" :rules="userFormRules" label-width="80px">
                                <el-form-item label="用户名称">
                                    <el-input v-model="editUserForm.username" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="邮箱" prop="email">
                                    <el-input v-model="editUserForm.email"></el-input>
                                </el-form-item>
                                <el-form-item label="手机号" prop="mobile">
                                    <el-input v-model="editUserForm.mobile"></el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="editDialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="editUser('editUserFormRef')">确 定</el-button>
                            </span>
                        </el-dialog>
                        <!-- 分配角色对话框 -->
                        <el-dialog
                            title="分配角色"
                            :visible.sync="distributeDialogVisible"
                            width="40%">
                            <el-select v-model="currentRid" placeholder="请选择">
                                <el-option
                                v-for="item in roleslist"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                                </el-option>
                            </el-select>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="distributeDialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="distributeRole(scope.row.id)">确 定</el-button>
                            </span>
                        </el-dialog>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页栏区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 3, 4]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
      var checkEmail = (rule, value, callback) => {
          var emailRule = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (!(emailRule.test(value)))   callback(new Error('请输入正确的邮箱'));
        callback();
      };
      var checkMobile = (rule, value, callback) => {
          var mobileRule = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
        if (!(mobileRule.test(value)))   callback(new Error('请输入正确的手机号'));
        callback();
      };
      return {
        //   获取用户列表的参数对象
        queryInfo: {
            query: '',
            pagenum: 1,
            pagesize: 2
        },
        userlist: [],
        total: 0,
        userFormRules: {
            username: [
                { required: true, message: '请输入用户名称', trigger: 'blur' },
            ],
            password: [
                { required: true, message: '请输入用户密码', trigger: 'blur' },
                { min: 6, message: '密码长度不得小于 6 个字符', trigger: 'blur' }
            ],
            email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator: checkEmail, trigger: 'blur' }
            ],
            mobile: [
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { validator: checkMobile, trigger: 'blur' }
            ],
        },
        addDialogVisible: false,
        addUserForm: {
            username: '',
            password: '',
            email: '',
            mobile: ''
        },
        editDialogVisible: false,
        editUserForm: {},
        distributeDialogVisible: false,
        roleslist: [],
        currentRid: ''
      }
  },
  created () {
      this.getUesrList()
      this.getRolesList()
  },
  methods: {
    //   获取用户数据列表
      async getUesrList () {
          const { data: res } = await this.$http.get('users', { params: this.queryInfo })
          if(res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
          this.userlist = res.data.users
          this.total = res.data.total
          console.log(this.userlist)
      },
    //   获取角色列表
      async getRolesList () {
          const { data: res } = await this.$http.get('roles')
          if(res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
          this.roleslist = res.data
      },
    //   改变 pagesize
      handleSizeChange(val) {
        this.queryInfo.pagesize = val
        this.getUesrList()
      },
    //   改变 当前页
      handleCurrentChange(val) {
        this.queryInfo.pagenum = val
        this.getUesrList()
      },
    //   搜索用户
      search () {
          this.getUesrList()
      },
    //   清除搜索栏
      clearSearchContent () {
          this.getUesrList()
      },
    //   显示添加用户对话框
      showAddDialog () {
          this.addDialogVisible = true
      },
    //   添加用户
      addUser (formName) {
          this.$refs[formName].validate(async valid => {
              if(!valid) return;
              const {data: res} = await this.$http.post('users', this.addUserForm);
              if(res.meta.status !== 201) return this.$message.error('添加用户失败!');
              this.addDialogVisible = false
              this.$message.success('添加用户成功');
              this.getUesrList()
          })
      },
    //   取消添加用户处理
      addHandleClose (formName) {
        this.addDialogVisible = false
        this.$refs[formName].resetFields();
      },
    //   修改用户状态
      async changeStatus (val) {
          const {data: res} = await this.$http.put(`users/${val.id}/state/${val.mg_state}`);
          if(res.meta.status !== 200){
            val.mg_state = !val.mg_state
            return this.$message.error('修改用户状态失败!');
          } 
          this.$message.success('添加用户状态成功');
      },
    //   显示编辑用户对话框
      async showEditDialog (id) {
          this.editDialogVisible = true
          const {data: res} = await this.$http.get(`users/${id}`);
          if(res.meta.status !== 200)   return this.$message.error('获取用户信息失败!');
          this.editUserForm = res.data
      },
    //   编辑用户
      async editUser (formName) {
          this.$refs[formName].validate(async valid => {
              if(!valid) return;
              const {data: res} = await this.$http.put(`users/${this.editUserForm.id}`,{
                                                        email: this.editUserForm.email,
                                                        mobile: this.editUserForm.mobile
                                                    });
              if(res.meta.status !== 200)   return this.$message.error('编辑用户提交失败!');
              this.editDialogVisible = false
              this.$message.success('编辑用户提交成功');
              this.getUesrList()
          })
      },
    //   取消编辑用户处理
      editHandleClose (formName) {
        this.editDialogVisible = false
        this.$refs[formName].resetFields();
      },
    //   显示删除用户对话框
      async showDeleteDialog (id) {
        const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if( result == 'confirm'){
            const {data: res} = await this.$http.delete(`users/${id}`);
            if(res.meta.status !== 200)   return this.$message.error('删除用户失败!');
            this.$message.success('删除用户成功');
            this.getUesrList()
        }
      },
    //   显示分配角色对话框
      async showDistributeDialog (id) {
          this.distributeDialogVisible = true
          const {data: res} = await this.$http.get(`users/${id}`)
          if(res.meta.status !== 200)   return this.$message.error('查询用户信息失败!');
          var isRid = this.roleslist.some(val => {
              return res.data.rid == val.id
          })
          if(isRid) this.currentRid = res.data.rid
      },
    //   分配角色
      async distributeRole (id) {
          const {data: res} = await this.$http.put(`users/${id}/role`, {rid: this.currentRid})
          if(res.meta.status !== 200)   return this.$message.error('分配角色失败!');
          this.distributeDialogVisible = false
          this.$message.success('分配角色成功')
          this.getUesrList()
      }
  }
}
</script>

<style lang='css' scoped>
</style>
