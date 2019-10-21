<template>
  <div>
    <div class="blog-header">
      <div class="title">你好json</div>
      <div>表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。</div>
    </div>

    <el-form :model="blogForm" :rules="rules" ref="blogForm">
      <el-form-item label="作者" prop="author">
        <el-input v-model="blogForm.author" />
      </el-form-item>
      <el-form-item label="题目" prop="title">
        <el-input v-model="blogForm.title" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="blogForm.description" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="blogForm.content" type="textarea" :rows="6" />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <input-label :form="blogForm" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import vue from "vue";
import { Form, FormItem, Input, Button } from "element-ui";
import axios from "axios";
import InputLabel from "@/components/InputLabel";

vue.use(Form);
vue.use(FormItem);
vue.use(Input);
vue.use(Button);

export default {
  name: "CreateBlog",
  components: {
    InputLabel
  },
  mounted: function() {
    const { type } = this.$route.params;
    const { id } = this.$route.query;

    if (type === "editor") {
      axios.get(`/api/getSimpleBlog?id=${id}`).then(res => {
        const { author, title, description, content, tags } = res.data[0];
        this.blogForm = {
          author,
          title,
          description,
          content,
          tags: {
            inputValue: "",
            tags
          }
        };

        console.log(this.blogForm);
      });
    }
  },
  methods: {
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
    submit: function() {
      this.$refs.blogForm.validate(valid => {
        if (valid) {
          const { author, title, description, content } = this.blogForm;
          const tags = this.blogForm.tags.tags;
          const { type } = this.$route.params;
          const { id } = this.$route.query;

          const url =
            type === "editor"
              ? `/api/updateSimpleBlog?id=${id}`
              : "/api/createBlog";

          axios
            .post(url, {
              author,
              title,
              description,
              content,
              tags
            })
            .then(result => {
              // 跳转博客展示页面
              this.$router.push("/home/blogs/show");
            });
        }
      });
    }
  },
  data: function() {
    return {
      blogForm: {
        author: "",
        title: "",
        description: "",
        content: "",
        tags: {
          inputValue: "",
          tags: []
        }
      },
      rules: {
        author: [
          {
            required: true,
            message: "作者不能为空"
          }
        ],
        title: [
          {
            required: true,
            message: "标题不能为空"
          }
        ],
        description: [
          {
            required: true,
            message: "描述不能为空"
          }
        ],
        content: [
          {
            required: true,
            message: "内容不能为空"
          }
        ],
        tags: [
          {
            required: true
          },
          {
            validator: this.testTags
          }
        ]
      }
    };
  }
};
</script>
<style lang='less' scoped>
.blog-header {
  background-color: #fff;
  padding: 20px 0 30px 20px;

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
}
</style>