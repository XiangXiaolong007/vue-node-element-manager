<template>
  <div id="app">
    <router-view/>
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
  created() {
    if(localStorage.eleToken) {
      // 解析token 
      const decodedToken = jwt_decode(localStorage.eleToken);

      // token存储到vuex
      this.$store.dispatch("setAuthenticated", !this.isEmpty(decodedToken));
      this.$store.dispatch("setUser", decodedToken);
    }
  },
  methods: {
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

<style>
html,body,#app {
  height: 100%;
  width: 100%;
}
#app {
}
</style>
