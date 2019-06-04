<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">龙哥哥在线后台管理系统</span>
      </div>
      <el-form
        :model="loginUser"
        status-icon
        :rules="rules"
        ref="loginForm"
        label-width="60px"
        class="login-form"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            type="text"
            v-model="loginUser.email"
            auto-complete="off"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="loginUser.password"
            auto-complete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit_btn" @click="submitForm('loginForm')">登  录</el-button>
        </el-form-item>
        <div class="tiparea">
            <p>还没有账号？现在<router-link to="/register">注册</router-link></p>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  name: "login",
  data() {
    return {
      loginUser: {
        email: "",
        password: ""
      },
      rules: {
        email: [
          {
            required: true,
            message: "邮箱不能为空",
            trigger: "blur"
          },
          {
            type: "email",
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
          {
            min: 6,
            max: 30,
            message: "长度在6到30个字符之间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  component: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.dir(this.$refs[formName])
          // console.log("submit!");
          this.$axios.post('/api/users/login', this.loginUser).then(res => {
            //   console.log(res)
            this.$message.success("登录成功")
            const { token } = res.data;

            // 解析token 
            const decodedToken = jwt_decode(token);
            // console.log(decodedToken)
            
            // token存储到vuex
            this.$store.dispatch("setAuthenticated", !this.isEmpty(decodedToken));
            this.$store.dispatch("setUser", decodedToken);

            // 存储到localStorate
            localStorage.setItem('eleToken', token);
            this.$router.push('/index');
          }).catch(err => {
            // 注册失败
            this.$message.error("登录失败");
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    isEmpty(value) {
      return (
        value === undefined || 
        value === null || 
        (typeof value === "object" && Object.keys(value).length === 0) || 
        (typeof value === "String" && value.trim().length === 0)
      )
    }
  }
};
</script>

<style scoped>
.login {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../assets/bg.jpg) no-repeat center center;
    background-size: 100% 100%;
}
.form_container {
    width: 370px;
    height: 210px;
    position: absolute;
    top: 20px;
    left: 34%;
    padding: 25px;
    border-radius: 5px;
    text-align: center;
}
.form_container .manage_tip .title {
    font-family: "Microsoft YaHei";
    font-weight: bold;
    font-size: 26px;
    color: #fff;
}
.login-form {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 40px 20px 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #ccc;
}
.submit_btn {
    width: 100%;
}
.tiparea {
    text-align: right;
    font-size: 12px;
    color: #333;
}
.tiparea p a {
    color: #409eff;
}
</style>

