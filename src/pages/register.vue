<template>
  <div :class="$style.bg">
    <el-form
      label-width="80px"
      :class="$style.login"
      :model="registerForm"
      :rules="rules"
      ref="register"
    >
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="registerForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" v-model="registerForm.password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          placeholder="请输入密码"
          v-model="registerForm.confirmPassword"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="register"
          :class="$style['btn-regitser']"
          >注册</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="less" module>
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
}
.btn-regitser {
  width: 100%;
}
</style>
<script>
import Vue from "vue";
import { Form, Input, FormItem, Button, Message } from "element-ui";
import axios from "axios";
import store from "store";

Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Button);
// Vue.use(Message);

export default {
  name: "register",
  mounted: () => {
    store.set("userInfo", {});
  },
  data: function() {
    const that = this;

    const testPassword = function(rules, value, callback) {
      const { password } = that.registerForm;

      if (password !== value) {
        callback("密码不对应");
      }

      callback();
    };

    return {
      registerForm: {
        username: "",
        password: "",
        confirmPassword: ""
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
        ],
        confirmPassword: [
          {
            required: true,
            message: "确认密码不能为空"
          },
          {
            validator: testPassword
          }
        ]
      }
    };
  },
  methods: {
    register: function() {
      const { username, password } = this.registerForm;

      this.$refs["register"].validate(valid => {
        if (valid) {
          axios.post("/api/register", { username, password }).then(result => {
            const { error, data } = result;

            if (!result.error) {
              Message.success({
                message: "注册成功"
              });

              // 跳转到登陆页面
              this.$router.push("/login");
            } else {
              Message.error({
                message: "注册失败"
              });
            }
          });
        }
      });
    }
  }
};
</script>
