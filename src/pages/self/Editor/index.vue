<template>
  <div class="self-setting">
    <el-tabs :tab-position="tabPosition" class="tabs">
      <el-tab-pane label="个人设置">
        <self-setting />
      </el-tab-pane>
      <el-tab-pane label="信息推送">信息推送</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Vue from "vue";
import SelfSetting from "./SelfSetting";
import { Button, Tabs, TabPane } from "element-ui";

Vue.use(Button);
Vue.use(Tabs);
Vue.use(TabPane);

export default {
  name: "SelfEditor",
  components: {
    SelfSetting
  },
  data: () => ({
    tabPosition: "left"
  })
};
</script>
<style lang="less" scoped>
.self-setting {
  background-color: #fff;
  padding: 16px 0;

  .tabs {
    /deep/ .el-tabs__header {
      width: 200px;
    }

    /deep/ .el-tabs__item {
      text-align: left;
    }
  }
}
</style>