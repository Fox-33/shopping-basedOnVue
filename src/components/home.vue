<template>
    <el-container id="home" class="home_container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <div class="home_logo">
                    <img src="../assets/logo.png" alt=""/>
                </div>
                <span>电商后台管理系统</span>
            </div>
            <el-button @click="logout" type="info">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle_botton" @click="toggleCollapse">|||</div>
                <el-menu
                    router	
                    :default-active="activePath"
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    unique-opened
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409eff">
                    <!-- 一级菜单 -->
                    <el-submenu v-for="item in menulist" :key="item.id" :index="item.id + ''">
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item-group>
                            <el-menu-item v-for="childrenitem in item.children" :key="childrenitem.id" :index="'/' + childrenitem.path" @click="saveNewState('/' + childrenitem.path)">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>{{ childrenitem.authName }}</span>
                                </template>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
    
</template>

<script>
export default {
  name: 'Home',
  data () {
      return {
          menulist: [],
          iconsObj: {
              125: 'iconfont icon-users',
              103: 'iconfont icon-tijikongjian',
              101: 'iconfont icon-shangpin',
              102: 'iconfont icon-danju',
              145: 'iconfont icon-baobiao'
          },
        //   是否折叠
          isCollapse: false,
        //   当前激活地址
          activePath: ''
      }
  },
  created () {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出登录
    logout () {
        window.sessionStorage.clear();
        this.$router.push('/login');    
    },
    // 获取菜单列表
    async getMenuList () {
        const {data: res} = await this.$http.get('menus')
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menulist = res.data
    },
    // 切换菜单折叠与展开
    toggleCollapse () {
        this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNewState (activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
    }
  }
}
</script>

<style lang='css' scoped>
.home_container {
    height: 100%;
}

.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    margin: 0;
    color: white;
    font-size: 20px;
}
.el-header div {
    display: flex;
    align-items: center;
}
.el-header div span {
    margin-left: 15px;
}
.home_logo {
    display: inline-block;
    height: 50px; 
    width: 50px;   
}
.home_logo img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eeeeee;
}

.el-aside {
    background-color: #333744;
}
.toggle_botton {
    width: 100%;
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: white;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
.el-aside .el-menu {
    border-right: none;
}
.iconfont {
    margin-right: 10px;
}

.el-main {
    background-color: #eaedf1;
}


</style>
