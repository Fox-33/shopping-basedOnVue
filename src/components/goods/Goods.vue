<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
                    <el-button @click="showAddDialog" type="primary">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="goodList" style="width: 100%" border stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name" width="400px"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
                <el-table-column label="创建时间" prop="add_time">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | formatDate }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button @click="showEditDialog(scope.row.goods_id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button @click="showDeleteDialog(scope.row.goods_id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
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
import moment from 'moment'
export default {
  name: 'Goods',
  data () {
      return {
        //   获取商品列表的参数对象
        queryInfo: {
            query: '',
            pagenum: 1,
            pagesize: 10
        },
        // 商品列表
        goodList: [],
        // 商品总数
        total: 0,
      }
  },
  created () {
      this.getGoodsList()
  },
  filters: {
      formatDate: function (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      }
  },
  methods: {
      async getGoodsList () {
          const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
          if(res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
          this.goodList = res.data.goods
          this.total = res.data.total
      },
    //   改变 pagesize
      handleSizeChange(val) {
        this.queryInfo.pagesize = val
        this.getGoodsList()
      },
    //   改变 当前页
      handleCurrentChange(val) {
        this.queryInfo.pagenum = val
        this.getGoodsList()
      },
    //   搜索商品
      search () {
          this.getGoodsList()
      },
    //   清除搜索栏
      clearSearchContent () {
          this.getGoodsList()
      },
    //   显示添加商品页面
      showAddDialog () {
          this.$router.push('/addgood'); 
      },
    //   显示编辑商品页面
      async showEditDialog (id) {
          this.$router.push(`/editgoods/${id}`); 
      },
    //   显示删除商品对话框
      async showDeleteDialog (id) {
          console.log(id)
        const result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if( result == 'confirm'){
            const {data: res} = await this.$http.delete(`goods/${id}`);
            if(res.meta.status !== 200)   return this.$message.error('删除商品失败!');
            this.$message.success('删除商品成功');
            this.getGoodsList()
        }
      }
  }
}
</script>

<style lang='css' scoped>
</style>
