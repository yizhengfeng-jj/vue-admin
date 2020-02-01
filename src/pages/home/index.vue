<template>
  <el-container>
    <div class='vue-aside'>
      <el-header class="aside-header">
        <img :src="userInfo.imgPath" />
        <span>{{userInfo.userName}}</span>
      </el-header>
      <el-aside class="aside">
        <el-menu
          class="el-menu-vertical-demo menu-demo"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#ffd04b"
          default-active="1-1"
          :collapse="state"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>个人中心</span>
            </template>
            <el-menu-item index="1-1">
              <router-link to="/home/selfDetail" slot="title">
                <i class="el-icon-document"></i>
                <span>个人中心</span>
              </router-link>
            </el-menu-item>
            <el-menu-item index="1-2">
              <router-link to="/home/selfEditor" slot="title">
                <i class="el-icon-document"></i>
                <span>个人设置</span>
              </router-link>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>博客中心</span>
            </template>
            <el-menu-item index="2-1">
              <router-link to="/home/blogs/info/new" slot="title">
                <i class="el-icon-document"></i>
                <span>博客中心</span>
              </router-link>
            </el-menu-item>
            <el-menu-item index="2-2">
              <router-link to="/home/blogs/show" slot="title">
                <i class="el-icon-document"></i>
                <span>博客预览</span>
              </router-link>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="3">
            <router-link to="/home/dashboard" slot="title">
              <i class="el-icon-document"></i>
              <span>dashboard</span>
            </router-link>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-document"></i>
            <span slot="title">列表页</span>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="el-icon-document"></i>
            <span slot="title">日志操作</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
    </div>
    <el-container class="main">
      <el-header class="header">
        <i class="el-icon-s-fold collaspe"></i>
        <div class="header_operator">
          <i class="el-icon-search"></i>
          <i class="el-icon-question"></i>
          <i class="el-icon-message"></i>
          <div class="header_operator_info">
            <img :src="userInfo.imgPath" />
            <span>{{userInfo.username}}</span>
          </div>
          <el-select v-model="lang" class="header_operator_lang">
            <el-option
              v-for="item in langOptions"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            />
          </el-select>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Vue from "vue";
import store from "store";
import { mapState, mapActions } from "vuex";
import {
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Select,
  Option
} from "element-ui";
import axios from "../../service/http";

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Select);
Vue.use(Option);

export default {
  name: "Home",
  computed: {
    ...mapState(["imgPath", "userInfo"])
  },
  methods: {
    ...mapActions(["changeImgPath", "changeUserInfo"])
  },
  mounted: function() {
    // 设置数据
    //const userInfo = store.get("userInfo") || {};
    //this.changeUserInfo(userInfo);
    // axios.get(`/api/getUserInfo?userId=${userId}`).then(result => {
    //   const { error, data } = result;
    //   const { imgPath } = data || {};
    //   console.log(data, 888);
    //   //this.userInfo = data;
    //   // 发送actions
    //   this.changeImgPath(imgPath);
    //   this.changeUserInfo(data);
    // });
  },
  data: () => {
    return {
      page: 12,
      state: false,
      langOptions: [
        {
          label: "中文",
          value: "chinaese"
        },
        {
          label: "英文",
          value: "english"
        },
        {
          label: "繁体",
          value: "fan"
        }
      ],
      lang: "chinaese"
    };
  }
};
</script>
<style  lang="less">
/* 更改element-ui样式 */
.menu-demo {
  /deep/ .is-active {
    background-color: #1890ff !important;
    color: #fff !important;
  }

  /deep/ .el-submenu .el-menu-item {
    padding: 0 !important;
  }

  > li > a{
     padding: 0 20px 0 0;
  }
}


/* 更改全局样式 */
a {
  text-decoration: none;
  outline: none;
  color: #fff;
  padding: 0 20px 0 40px;
  box-sizing: border-box;
  width: 100%;
  display: inline-block;
}

p {
  margin: 0;
}
/* 更改全局样式结束*/
.vue-aside{
  background-color: #001529;
}
.aside-header {
  line-height: 60px;
  background-color: #001529;
  font-size: 20px;
  color: #fff;

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 8px;
  }
}

.main {
  background-color: #f0f2f5;

  .header {
    background-color: #fff;
    display: flex;
    justify-content: space-between;

    i {
      line-height: 60px;
      font-size: 16px;
      padding: 0 10px;
    }

    .collaspe {
      font-size: 35px;
      cursor: pointer;
    }

    .header_operator {
      display: flex;
      justify-content: space-between;

      .header_operator_info {
        line-height: 60px;
        padding: 0 10px;

        img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          vertical-align: middle;
          margin-right: 8px;
        }
      }

      .header_operator_lang {
        line-height: 60px;
        width: 100px;
      }
    }
  }
}

.aside {
  width: 256px !important;
  overflow: hidden;
  background-color: #001529;
  min-height: 100vh;
}

.menu-demo {
  height: 100%;
  border-right-width: 0;
}
</style>