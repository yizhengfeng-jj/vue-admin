<template>
  <div :class="$style['blog-component']">
    <div :class="$style.head">{{ title }}</div>
    <div :class="$style.tags">
      <el-tag v-for="tag in tags" :key="tag" :class="$style.tag">{{
        tag
      }}</el-tag>
    </div>
    <div :class="$style.content">
      <span>博客内容：</span>
      {{ content }}
    </div>
    <div :class="$style['blog_info']">
      <span :class="$style['blog_info--author']">{{ author }}</span> 发布于
      <span :class="$style['blog_info--adress']">{{ address }}</span>
      <span :class="$style['blog_info--time']">{{ time }}</span>
    </div>
    <div :class="$style['blog_like']">
      <span>
        <i :class="$style['el-icon-star-on']"></i>
        {{ likeCount }}
      </span>
      <span>
        <i :class="$style['el-icon-view']"></i>
        {{ collectionCount }}
      </span>
    </div>
  </div>
</template>
<style lang="less" module>
.blog-component {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 24px;
  margin-top: 12px;

  .head {
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
  }

  .tags .tag {
    &:not(:nth-child(1)) {
      margin: 8px;
    }
  }

  .content {
    margin: 0 0 16px 0;
  }

  .blog_info {
    .blog_info--author,
    .blog_info--adress {
      color: #1890ff;
    }

    .blog_info--time {
      color: rgba(0, 0, 0, 0.25);
      margin-left: 16px;
    }
  }

  .blog_like {
    margin-top: 20px;
    font-size: 14px;

    span {
      padding: 0 12px;
      border-right: solid 1px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
<script>
import Vue from "vue";
import { Tag } from "element-ui";

Vue.use(Tag);

export default {
  name: "BlogShow",
  props: {
    title: String,
    tags: Array,
    content: String,
    author: String,
    address: String,
    likeCount: Number,
    collectionCount: Number,
    time: String
  },
  data: () => ({})
};
</script>
