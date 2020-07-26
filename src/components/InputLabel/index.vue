<template>
  <div>
    <el-input
      v-model="content"
      @keyup.enter.native="changeTags"
      @input="changeValue"
      @blur="changeTags"
    />
    <el-tag
      v-for="(tag, index) in tags"
      :key="tag"
      closable
      @close="closeTag(index)"
      >{{ tag }}</el-tag
    >
  </div>
</template>
<script>
import Vue from "vue";
import { Input, Tag } from "element-ui";
import emitter from "element-ui/src/mixins/emitter";

Vue.use(Input);
Vue.use(Tag);
export default {
  name: "InputLable",
  props: {
    form: Object
  },
  mixins: [emitter],
  watch: {
    form: function() {
      this.tags = this.form.tags.tags;
    }
  },
  methods: {
    changeValue: function() {
      this.form.tags = { tags: this.tags, content: this.content };
    },
    changeTags: function() {
      if (!this.tags.includes(this.content) && this.content) {
        this.tags.push(this.content);
      }
      this.content = "";

      this.form.tags = { tags: this.tags, content: this.content };
    },
    closeTag: function(index) {
      this.tags.splice(index, 1);

      if (this.content && !this.tags.includes(this.content)) {
        this.tags.push(this.content);
      }
      this.form.tags = { tags: this.tags, content: "" };
      this.dispatch("ElFormItem", "el.form.blur");
    }
  },
  data: function() {
    return {
      content: "",
      tags: this.form.tags.tags
    };
  }
};
</script>
<style lang="less" module>
.el-tag:not(:nth-child(1)) {
  margin: 8px 8px 0 0;
}

.el-test {
  color: red;
}
</style>
