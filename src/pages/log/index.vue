<template>
  <el-table :data="dataSource">
    <el-table-column prop="level" label="级别">
      <template slot-scope="scope">
        <span v-if="scope.row.level === '1'" :class="$style.info">{{
          levelInfo[scope.row.level]
        }}</span>
        <span v-if="scope.row.level === '2'" :class="$style.dangerous">{{
          levelInfo[scope.row.level]
        }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="time" label="时间">
      <template slot-scope="scope">
        <span>{{ transformtime(scope.row.time) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="user" label="用户"></el-table-column>
    <el-table-column prop="action" label="动作"></el-table-column>
    <el-table-column prop="description" label="描述"></el-table-column>
  </el-table>
</template>

<style lang="less" module>
.info {
  color: green;
}
.dangerous {
  color: red;
}
</style>

<script>
import Vue from "vue";
import { Table, TableColumn } from "element-ui";
import axios from "@/service/http";
import moment from "moment";

// 注册
Vue.use(Table);
Vue.use(TableColumn);

export default {
  name: "Log",
  mounted: function() {
    // 发送请求获取log数据
    axios.get("/api/log").then(result => {
      const { data } = result || {};
      console.log(data, 'data...........');
      this.dataSource = data;
    });
  },
  methods: {
    transformtime: time => {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  data: function() {
    return {
      dataSource: [],
      levelInfo: {
        1: "普通",
        2: "危险"
      }
    };
  }
};
</script>
