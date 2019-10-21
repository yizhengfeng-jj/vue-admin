<template>
  <div class="bg">
    <el-form label-width="80px" class="login" :rules="rules" :model="loginForm" ref="loginForm">
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="loginForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" v-model="loginForm.password" />
      </el-form-item>
      <el-form-item class="btn" label>
        <el-button type="primary" @click="login">登录</el-button>
        <router-link to="register">
          <el-button type="primary">注册</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="less">
.bg {
  background-image: url("../img/bg3.jpg");
  background-size: 100%;
  height: 100vh;
}

.login {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;

  .el-form-item__label {
    color: #fff;
  }

  .el-form-item__content {
    margin-left: 80px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
<script>
import Vue from "vue";
import { mapActions } from "vuex";
import { Form, Input, FormItem, Button, Message } from "element-ui";
import axios from "axios";
import store from "store";

Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Button);
// Vue.use(Message);

export default {
  name: "Login",
  mounted: () => {
    store.set("userInfo", {});
  },
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
    ...mapActions(["changeUserInfo"]),
    login: function() {
      const { username, password } = this.loginForm;

      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          axios.post("/api/login", { username, password }).then(res => {
            const { error, data } = res;
            const { token, userId } = data || {};

            store.set("httpInfo", { userId, token });

            if (error === 0) {
              axios.get(`/api/getUserInfo?userId=${userId}`).then(result => {
                const { error, data } = result;
                const { imgPath } = data || {};

                // 把信息写入store
                store.set("userInfo", { ...data, token, userId });

                Message.success({
                  message: "登录成功"
                });

                this.changeUserInfo(data);

                // 跳转到home主页面
                this.$router.push("/home/selfDetail");
              });
            } else {
              Message.error({
                message: "您还没有注册"
              });
            }
          });
        }
      });
    }
  }
};
</script>