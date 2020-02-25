<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <div id="myChart" class="myChart"></div>
        </el-card>
    </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'Goods',
  data () {
      return {
      }
  },
  created () {
  },
  mounted(){
    this.drawLine();
  },
  methods: {
    async drawLine(){
        const {data: res} = await this.$http.get('reports/type/1')
        if(res.meta.status !== 200) return this.$message.error('获取报表失败')
        this.$set(res.data, 'title', { text: '用户来源' })
        res.data.xAxis.forEach(val => {
            this.$set(val, 'boundaryGap', false)
        })
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        let option = res.data
        myChart.setOption(option);
    }
  }
}
</script>

<style lang='css' scoped>
#myChart {
    width: 100%;
    height: 400px;
}
</style>
