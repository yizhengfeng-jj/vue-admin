<template>
  <el-form label-width="80px" class="login" :rules="rules" :model="loginForm" ref="loginForm">
    <el-form-item label="用户名" prop="username">
      <el-input placeholder="请输入用户名" v-model="loginForm.username" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input placeholder="请输入密码" v-model="loginForm.password" />
    </el-form-item>
    <el-form-item class="btn">
      <el-button type="primary" @click="login">登录</el-button>
      <router-link to="register">
        <el-button type="primary" @click="register">注册</el-button>
      </router-link>
    </el-form-item>
  </el-form>
</template>
<style type='text/css'>
body {
  background-image: url("https://img.infinitynewtab.com/wallpaper/2380.jpg");
}

.login {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
}

.btn {
  display: flex;
  justify-content: space-between;
}
</style>
<script>
import Vue from "vue";
import { Form, Input, FormItem, Button, Message } from "element-ui";
import axios from "axios";

Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Button);
// Vue.use(Message);

export default {
  name: "Login",
  data: () => ({
    loginForm: {
      username: "",
      password: ""
    },
    rules: {
      username: [
        {
          required: true,
          message: "用户名不能为空"
        }
      ],
      password: [
        {
          required: true,
          message: "密码不能为空"
        }
      ]
    }
  }),
  methods: {
    login: function() {
      const { username, password } = this.loginForm;

      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          axios.post("/api/login", { username, password }).then(res => {
            const { error } = res.data;

            if (error === 0) {
              Message.success({
                message: "登录成功"
              });
            } else {
              Message.error({
                message: "您还没有注册"
              });
            }
          });
        }
      });
    },
    register: function() {}
  }
};
</script>