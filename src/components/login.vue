<template>
  <div id="login" class="login">
      <div class="login_box">
          <div class="login_logo">
              <img src="../assets/logo.png"/>
          </div>
          <el-form ref="loginFormRef" :model='loginForm' :rules="rules" class="login_form">
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
            </el-form-item>
            <el-form-item class="login_btns">
                <el-button @click="login('loginFormRef')" type="primary">登录</el-button>
                <el-button @click="resetForm('loginFormRef')" type="info">重置</el-button>
            </el-form-item>
          </el-form>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
      return {
          loginForm: {
              username: '',
              password: ''
          },
          rules: {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入用户密码', trigger: 'blur' }
            ],
          }
      }
  },
  methods: {
      login(formName) {
          this.$refs[formName].validate(async valid => {
              if(!valid) return;
              const {data: res} = await this.$http.post('login', this.loginForm);
              if(res.meta.status !== 200) return this.$message.error('登录失败!');
              this.$message.success('登录成功');
            //   1. 将成功之后的 token 保存到客户端的 sessionStorage 中
            //     1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
            //     1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
              window.sessionStorage.setItem("token", res.data.token);
            //   2. 通过编程式导航跳转到后台管理系统页面，路由地址是 /home
              this.$router.push('/home'); 
          })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
  }
}
</script>

<style lang='css' scoped>
.login {
    height: 100%;
}
.login_box {
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.login_logo {
    width: 130px;
    height: 130px;
    background-color: #eeeeee;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    /* top: -50%; */
    transform: translate(-50%, -50%);
    border: 10px white solid;
    box-shadow: 0 0 10px #eeeeee;
}
.login_logo img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.login_btns {
    display: flex;
    justify-content: flex-end;
}
</style>
