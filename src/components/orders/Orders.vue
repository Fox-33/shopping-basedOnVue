<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 用户列表区域 -->
            <el-table :data="ordersList" style="width: 100%" border stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price" width="80px"></el-table-column>
                <el-table-column label="是否付款"  width="80px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.order_pay == 1" type="success" size="mini">已付款</el-tag>
                        <el-tag v-else type="danger" size="mini">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"  width="80px"></el-table-column>
                <el-table-column label="下单时间" prop="create_time" width="150px">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | formatDate }}
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
        ordersList: [],
        // 商品总数
        total: 0,
        infoDialogVisible: false,
        infoForm: {},
        activities: [{
                        content: '活动按期开始',
                        timestamp: '2018-04-15'
                     }, {
                        content: '通过审核',
                        timestamp: '2018-04-13'
                     }, {
                        content: '创建成功',
                        timestamp: '2018-04-11'
                     }]
      }
  },
  created () {
      this.getOrdersList()
  },
  filters: {
      formatDate: function (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      }
  },
  methods: {
    //   获取订单列表
      async getOrdersList () {
          const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
          if(res.meta.status !== 200) return this.$message.error('获取订单列表失败！')
          this.ordersList = res.data.goods
          this.total = res.data.total
      },
    //   改变 pagesize
      handleSizeChange(val) {
        this.queryInfo.pagesize = val
        this.getOrdersList()
      },
    //   改变 当前页
      handleCurrentChange(val) {
        this.queryInfo.pagenum = val
        this.getOrdersList()
      },
  }
}
</script>

<style lang='css' scoped>
</style>
