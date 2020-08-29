<template>
  <el-row :gutter="24" :class="$style['self-main']">
    <el-col :span="7">
      <div :class="$style.info">
        <div :class="$style['info-head']">
          <div :class="$style['info-head_pic']">
            <p>
              <img :src="userInfo.imgPath" />
            </p>
            <p>{{ userInfo.userName || "这个人很懒什么都没留下" }}</p>
            <p>{{ userInfo.nickName || "这个人很懒什么都没留下" }}</p>
          </div>
          <div :class="$style['info-head_description']">
            <p>
              <span :class="$style['el-icon-suitcase-1']"></span>
              <span>{{
                userInfo.description || "这个人很懒什么都没留下"
              }}</span>
            </p>
            <p>
              <span :class="$style['el-icon-message']"></span>
              <span>{{ userInfo.email || "这个人很懒什么都没留下" }}</span>
            </p>
            <p>
              <span :class="$style['el-icon-location-outline']"></span>
              <span>{{ this.address || "这个人很懒什么都没留下" }}</span>
            </p>
          </div>
          <el-divider></el-divider>
        </div>
        <div :class="$style['info-tag']">
          <div>标签</div>
          <div>
            <el-tag v-for="item in userInfo.tags" :key="item" :class="$style.tag">{{
              item
            }}</el-tag>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="17">
      <div :class="$style.blog">
        <div :class="$style.title">文章</div>
        <blog-show
          v-for="(blog, index) in blogs"
          :key="index"
          :title="blog.title"
          :content="blog.content"
          :address="blog.address"
          :author="blog.author"
          :likeCount="blog.likeCount"
          :collectionCount="blog.collectionCount"
          :time="blog.time"
          :tags="blog.tags"
        />
      </div>
    </el-col>
  </el-row>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";
import { Row, Col, Divider, Tag } from "element-ui";
import axios from "@/service/http";
import BlogShow from "Components/BlogShow";
import citys from "@/util/chartData.json";

Vue.use(Row);
Vue.use(Col);
Vue.use(Divider);
Vue.use(Tag);

export default {
  name: "SelfDetail",
  components: {
    BlogShow
  },
  computed: {
    ...mapState(["imgPath", "userInfo"]),
    address: function() {
      const city = citys.find(city => {
        return city.value === this.userInfo.address;
      });

      return city && city.name;
    }
  },
  data: () => ({
    blogs: new Array(8).fill({
      title: "promise小谈",
      content: "promise是我们代码经常用到的比较有用的的语法.......",
      author: "json",
      time: "2019/9/26 19:22:32",
      address: "www.jianshu.com",
      tags: ["es6", "promise"],
      likeCount: 20,
      collectionCount: 30
    })
  })
};
</script>
<style lang="less" module>
.self-main {
  display: flex;

  .info {
    background-color: #fff;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 24px;
    height: 100%;
    box-sizing: border-box;

    .info-head_pic {
      text-align: center;
      margin-bottom: 20px;

      p {
        line-height: 30px;

        &:nth-child(2) {
          color: rgb(0, 0, 0);
          font-size: 20px;
        }

        img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      }
    }

    .info-head_description {
      margin-bottom: 20px;

      p {
        line-height: 30px;

        span:nth-child(1) {
          margin-right: 10px;
        }
      }
    }

    .info-tag {
      .tag {
        margin: 8px;
      }
    }
  }

  .blog {
    background-color: #fff;
    padding: 24px;

    .title {
      color: #1890ff;
      font-weight: 500px;
      font-size: 16px;
    }
  }
}
</style>
