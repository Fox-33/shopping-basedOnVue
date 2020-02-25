<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 添加角色按钮 -->
            <el-button @click="showAddDialog()" type="primary">添加角色</el-button>
            <!-- 添加角色对话框 -->
            <el-dialog
                title="添加角色"
                :visible.sync="addDialogVisible"
                width="40%"
                @close="addHandleClose('addRoleFormRef')">
                <el-form ref="addRoleFormRef" :model="addRoleForm" :rules="roleFormRules" label-width="80px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="addRoleForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="addRoleForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addRole('addRoleFormRef')">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 角色列表区域 -->
            <el-table ref="rolesTableRef" :data="roleslist" stripe border style="width: 100%">
                <el-table-column type="expand" >
                    <template slot-scope="props" >
                        <el-row :key="leveloneright.id" v-for="leveloneright in props.row.children" class="expendBorderOutside"  type='flex' align='middle'>
                            <!-- 一级权限 -->
                            <el-col :span="5" >
                                <el-tag 
                                    @close="rightDelete({row: props.row, rightId: leveloneright.id})" 
                                    closable 
                                    :disable-transitions="false" >
                                    {{leveloneright.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级权限 -->
                            <el-col :span="19">
                                <el-row :key="leveltworight.id" v-for="leveltworight in leveloneright.children" class="expendBorderInside"  type='flex' align='middle'>
                                    <el-col :span="10">
                                        <el-tag 
                                            @close="rightDelete({row: props.row, rightId: leveltworight.id})" 
                                            type='success'
                                            closable 
                                            :disable-transitions="false" >
                                            {{leveltworight.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="14">
                                        <el-tag 
                                            :key="levelthreeright.id" v-for="levelthreeright in leveltworight.children" 
                                            @close="rightDelete({row: props.row, rightId: levelthreeright.id})" 
                                            type='warning'
                                            closable 
                                            :disable-transitions="false" >
                                            {{levelthreeright.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button @click="showDeleteDialog(scope.row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </el-tooltip>
                        <!-- 分配权限按钮 -->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button @click="showDistributeDialog(scope.row.id)" type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                        <!-- 编辑角色对话框 -->
                        <el-dialog
                            title="编辑角色"
                            :visible.sync="editDialogVisible"
                            width="40%"
                            @close="editHandleClose('editRoleFormRef')">
                            <el-form ref="editRoleFormRef" :model="editRoleForm" :rules="roleFormRules" label-width="80px">
                                <el-form-item label="角色名称" prop="roleName">
                                    <el-input v-model="editRoleForm.roleName"></el-input>
                                </el-form-item>
                                <el-form-item label="角色描述" prop="roleDesc">
                                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="editDialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="editRole('editRoleFormRef')">确 定</el-button>
                            </span>
                        </el-dialog>
                        <!-- 分配权限对话框 -->
                        <el-dialog
                                title="分配权限"
                                :visible.sync="distributeDialogVisible"
                                width="40%" 
                                @opened="DistributeDialogOpened"
                                :before-close="DistributeDialogClose">
                            <el-tree
                                :data="rightslist"
                                show-checkbox
                                default-expand-all
                                node-key="id"
                                ref="rightsTree"
                                highlight-current
                                :props="rightsProps">
                            </el-tree>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="distributeDialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="distributeRole(scope.row.id)">确 定</el-button>
                            </span>
                        </el-dialog>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
      return {
          roleslist: [],
          editDialogVisible: false,
          editRoleForm: {},
          roleFormRules: {
            roleName: [
                { required: true, message: '请输入角色名称', trigger: 'blur' }
            ],
            roleDesc: [
                { required: true, message: '请输入角色描述', trigger: 'blur' }
            ]
          },
          rightslist: [],
          rightsProps: {
            children: 'children',
            label: 'authName'
          },
          distributeDialogVisible: false,
          CheckedKeys : [],
          addDialogVisible: false,
          addRoleForm: {}
      }
  },
  created () {
      this.getRolesList()
      this.getRightsList()
  },
  methods: {
    //   获取角色列表
      async getRolesList () {
          const { data: res } = await this.$http.get('roles')
          if(res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
          this.roleslist = res.data
      },
    //   获取权限列表
      async getRightsList () {
          const { data: res } = await this.$http.get('rights/tree')
          if(res.meta.status !== 200)   return this.$message.error('获取权限列表失败！')
          this.rightslist = res.data
      },
    //   删除当前权限
      async rightDelete (info) {
          const { data: res } = await this.$http.delete(`roles/${info.row.id}/rights/${info.rightId}`)
          if(res.meta.status !== 200){
              return this.$message.error('取消角色权限失败！')
          } 
          info.row.children = res.data
          this.$message.success('取消角色权限成功！')
      },
    //   显示编辑角色对话框
      async showEditDialog (id) {
          this.editDialogVisible = true
          const {data: res} = await this.$http.get(`roles/${id}`);
          if(res.meta.status !== 200)   return this.$message.error('获取角色信息失败!');
          this.editRoleForm = res.data
      },
    //   提交编辑角色信息
      editRole (formName) {
          this.$refs[formName].validate(async valid => {
              if(!valid) return;
              const {data: res} = await this.$http.put(`roles/${this.editRoleForm.roleId}`,{
                                                        roleName: this.editRoleForm.roleName,
                                                        roleDesc: this.editRoleForm.roleDesc
                                                    });
              if(res.meta.status !== 200)   return this.$message.error('编辑角色提交失败!');
              this.editDialogVisible = false
              this.$message.success('编辑角色提交成功');
              this.getRolesList()
          })
      },
    //   取消编辑角色处理
      editHandleClose (formName) {
          this.editDialogVisible = false
          this.$refs[formName].resetFields();
      },
    //   显示删除角色对话框
      async showDeleteDialog (id) {
        const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if( result == 'confirm'){
            const {data: res} = await this.$http.delete(`roles/${id}`);
            if(res.meta.status !== 200)   return this.$message.error('删除角色失败!');
            this.$message.success('删除角色成功');
            this.getRolesList()
        }
      },
    //   显示分配权限对话框
      showDistributeDialog (id) {
          this.distributeDialogVisible = true
          var index = this.roleslist.findIndex(item => {
              return item.id == id
          })
          this.roleslist[index].children.forEach(val1 => {
              this.CheckedKeys.push(val1.id)
              val1.children.forEach(val2 => {
                this.CheckedKeys.push(val2.id)
                val2.children.forEach(val3 => {
                    this.CheckedKeys.push(val3.id)
                })
              })
          })
      },
    //   分配权限对话框打开
      DistributeDialogOpened () {
          this.$refs['rightsTree'].setCheckedKeys(this.CheckedKeys);
      },
    //   分配权限对话框关闭
      DistributeDialogClose (close) {
          this.CheckedKeys = []
          this.$refs['rightsTree'].setCheckedKeys(this.CheckedKeys);
          close()
      },
    //   提交分配权限信息
      async distributeRole (roleId) {
          this.CheckedKeys =this.$refs['rightsTree'].getCheckedKeys()
          var rids = ''
          this.CheckedKeys.forEach(key => {
              rids += ( key + ',' )
          })
          const {data: res} = await this.$http.post(`roles/${roleId}/rights`, {rids: rids})
          if(res.meta.status !== 200)   return this.$message.error('分配角色权限失败!');
          this.distributeDialogVisible = false
          this.$message.success('分配角色权限成功');
      },
    //   显示添加角色对话框
      showAddDialog () {
          this.addDialogVisible = true
      },
    //   提交添加角色信息
      addRole (formName) {
          this.$refs[formName].validate(async valid => {
              if(!valid) return;
              const {data: res} = await this.$http.post('roles',{
                                                        roleName: this.addRoleForm.roleName,
                                                        roleDesc: this.addRoleForm.roleDesc
                                                    });
              if(res.meta.status !== 201)   return this.$message.error('添加角色提交失败!');
              this.addDialogVisible = false
              this.$message.success('添加角色提交成功');
              this.getRolesList()
          })
      },
    //   取消添加角色处理
      addHandleClose (formName) {
          this.addDialogVisible = false
          this.$refs[formName].resetFields();
      }
  }
}
</script>

<style lang='css' scoped>
.expendBorderOutside {
    border-top: 1px solid rgba(0, 0, 0, .12);
}
.expendBorderOutside:last-child {
    border-bottom: 1px solid rgba(0, 0, 0, .12);
}
.expendBorderInside {
    border-bottom: 1px solid rgba(0, 0, 0, .12);
}
.expendBorderInside:last-child {
    border-bottom: 0;
}
.el-tag {
    margin: 10px;
}
</style>
