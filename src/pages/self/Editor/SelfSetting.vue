<template>
  <div :class="$style.setting">
    <div :class="$style.setting_title">个人设置</div>
    <el-row>
      <el-col :span="8">
        <el-form :model="selfForm" :rules="rules" ref="selfForm">
          <el-form-item prop="userName" label="姓名">
            <el-input placeholder="请输入姓名" v-model="selfForm.userName" />
          </el-form-item>
          <el-form-item prop="nickName" label="昵称">
            <el-input placeholder="请输入昵称" v-model="selfForm.nickName" />
          </el-form-item>
          <el-form-item prop="email" label="邮箱">
            <el-input placeholder="请输入邮箱" v-model="selfForm.email" />
          </el-form-item>
          <el-form-item prop="description" label="描述">
            <el-input placeholder="请输入描述" v-model="selfForm.description" />
          </el-form-item>
          <el-form-item prop="tags" label="个性标签">
            <input-label :form="selfForm" />
          </el-form-item>
          <el-form-item prop="address" label="作者地址">
            <el-select v-model="selfForm.address" :class="$style['city-info']">
              <el-option
                v-for="city in citys"
                :value="city.value"
                :label="city.name"
                :key="city.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="16" :class="$style.upload">
        <div>头像</div>
        <div>
          <img :src="userInfo.imgPath" />
        </div>
        <div>
          <el-upload
            action="http://localhost:9001/expressApi/upload"
            :on-success="dealSuccess"
            :on-error="dealError"
            :headers="headers"
            :multiple="true"
          >
            <el-button>
              <span :class="$style['el-icon-upload2']"></span>
              上传图片
            </el-button>
          </el-upload>
        </div>
      </el-col>
    </el-row>
    <el-button type="primary" @click="submit">保存</el-button>
  </div>
</template>
<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import {
  Row,
  Col,
  Form,
  FormItem,
  Input,
  Upload,
  Select,
  Option
} from "element-ui";
import store from "store";
import axios from "@/service/http";
import InputLabel from "@/components/InputLabel";
import citys from "@/util/chartData.json";
import setLogs from '../../../util/setLogs';

Vue.use(Row);
Vue.use(Col);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Upload);

export default {
  name: "SelfSetting",
  components: {
    InputLabel
  },
  mounted: function() {
    const { token, userId } = store.get("httpInfo") || {};

    this.headers = { Authorization: token, userId };
  },
  computed: {
    ...mapState(["imgPath", "userInfo"])
  },
  data: function() {
    const { userName, nickName, email, description, tags, address = '' } = store.get(
      "userInfo"
    );

    return {
      selfForm: {
        userName,
        nickName,
        email,
        description,
        tags: {
          content: "",
          tags
        },
        address
      },
      rules: {
        userName: [
          {
            required: true,
            message: "名称不能为空"
          }
        ],
        nickName: [
          {
            required: true,
            message: "昵称不能为空"
          }
        ],
        email: [
          {
            required: true,
            message: "邮箱不能为空"
          }
        ],
        description: [{}],
        tags: [
          {
            required: true,
            validator: this.testTags
          }
        ],
        address: [
          {
            required: true,
            message: "个性签名不能为空"
          }
        ]
      },
      headers: {
        Authorization: "",
        userId: "",
        charset: "gbk"
      },
      citys
    };
  },
  methods: {
    ...mapActions(["changeImgPath", "changeUserInfo"]),
    testTags: function(rules, value, callback) {
      const { content } = value || {};
      let { tags } = value;

      tags = Array.isArray(tags) ? tags : [];

      if (!content && !tags.length) {
        callback("标签不能为空");
      }

      if (tags.includes(content)) {
        callback("标签不能重复");
      }

      callback();
    },
    dealSuccess: function(res, file) {
      const { data } = res;
      const userInfo = store.get("userInfo");

      userInfo.imgPath = data;
      this.changeUserInfo(userInfo);

      // 发送日志
      setLogs({
        level: 1,
        user: userInfo.userName,
        action: '修改',
        description: '修改个人头像成功'
      })
      
    },
    dealError: () => {

       // 发送日志
      setLogs({
        level: 2,
        user: userInfo.userName,
        action: '修改',
        description: '修改个人头像失败'
      })
    },
    submit: function() {
      this.$refs["selfForm"].validate(valid => {
        if (valid) {
          const {
            userName,
            nickName,
            email,
            description,
            address
          } = this.selfForm;

          const tags = this.selfForm.tags.tags || {};
          const { userId } = store.get("userInfo");
          const body = {
            userName,
            nickName,
            email,
            description,
            tags,
            address
          };

          // 更改userInfo
          this.changeUserInfo(body);

          // 修改个人信息
          axios
            .post(`/api/editorUserInfo?userId=${userId}`, body)
            .then(result => {
              // 跳转

              const { imgPath } = store.get("userInfo");

              if (result.error === 0) {
                const userInfo = { ...body, imgPath, tags };

                store.set("userInfo", userInfo);
                this.changeUserInfo(userInfo);
                this.$router.push("/home/selfDetail");

                // 发送日志
                setLogs({
                  level: 1,
                  user: userName,
                  action: '修改',
                  description: '修改个人信息'
                })
              }
            });
        }
      });
    }
  }
};
</script>
<style lang="less" module>
.setting {
  padding: 0 24px;

  .setting_title {
    margin-bottom: 16px;
    font-size: 20px;
  }

  .city-info {
    width: 100%;
  }

  .upload {
    padding: 16px 0 0 104px;

    img {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      margin: 16px 0;
    }
  }
}
</style>
