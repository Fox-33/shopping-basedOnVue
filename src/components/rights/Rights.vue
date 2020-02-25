<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <el-table :data="rightslist" stripe border style="width: 100%">
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == 0" size="mini">一级</el-tag>
                        <el-tag v-else-if="scope.row.level == 1" type="success" size="mini">二级</el-tag>
                        <el-tag v-else type="warning" size="mini">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
  name: 'Rights',
  data () {
      return {
          rightslist: []
      }
  },
  created () {
      this.getRightsList()
  },
  methods: {
      async getRightsList () {
          const { data: res } = await this.$http.get('rights/list')
          if(res.meta.status !== 200) return this.$message.error('获取权限列表失败！')
          this.rightslist = res.data
      },
  }
}
</script>

<style lang='css' scoped>
</style>
