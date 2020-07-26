<template>
  <div>
    <div :class="$style.title">博客展示</div>
    <el-table :data="tableData">
      <el-table-column prop="order" label="序号" />
      <el-table-column prop="createTime" label="创建时间" sortable />
      <el-table-column
        prop="author"
        label="作者"
        :filters="filtersData"
        :filter-method="filterAuthor"
      />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="tags" label="标签">
        <template slot-scope="scope">
          <el-tag v-for="tag in scope.row.tags" :key="tag" :class="$style.tag" disable-transitions>{{tag}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editorBlog(scope.row.id)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteBlog(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import vue from "vue";
import { Table, TableColumn, Tag, MessageBox, Message } from "element-ui";
import store from 'store';
import axios from "axios";
import moment from "moment";
import setLogs from '../../../util/setLogs';

vue.use(Table);
vue.use(TableColumn);
vue.use(Tag);

export default {
  name: "ShowBlogs",
  data: function() {
    return {
      tableData: [],
      filtersData: []
    };
  },
  methods: {
    getList: function() {
      axios.get("/api/getList").then(res => {
        const data = Array.isArray(res && res.data) ? res && res.data : [];

        const tableData = data.map((item, index) => {
          const { createTime, author, title, description, tags, id } =
            item || {};

          return {
            order: index + 1,
            createTime: moment(createTime).format("YYYY-MM-DD HH:mm:ss"),
            author,
            title,
            description,
            tags,
            id
          };
        });

        let filtersData = [];
        data.forEach(item => {
          const { author } = item || {};

          const ifRepeat = filtersData.some(filter => filter.text === author);

          !ifRepeat && filtersData.push({ text: author, value: author });
        });

        this.filtersData = Array.from(new Set(filtersData));
        this.tableData = tableData;
      });
    },
    filterAuthor: function(value, row, column) {

      const { property } = column;

      return row[property] === value;
    },
    editorBlog: function(id) {
      this.$router.push({ path: "/home/blogs/info/editor", query: { id } });
    },
    deleteBlog: function(id) {
      MessageBox.confirm("确认删除所选博客么?", "提示", {
        confirmButtonText: "确认",
        cancalButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          axios.get(`api/deleteSimple?id=${id}`).then(res => {
            const userInfo = store.get('userInfo');

            if (res.error === 0) {
              Message.info("删除成功");
              this.getList();

               // 发送日志
              setLogs({
                level: 2,
                user: userInfo.userName,
                action: '删除',
                description: '删除博客成功'
              })
            }
          });
        })
        .catch(res => {
          Message.info("已经取消");

           // 发送日志
            setLogs({
              level: 2,
              user: userInfo.userName,
              action: '删除',
              description: '删除博客失败'
            })
        });
    }
  },
  mounted: function() {
    // 获取博客内容
    this.getList();
  }
};
</script>
<style lang='less' module>
.title {
  margin-bottom: 20px;
}

.tag {
  margin-right: 8px;
}
</style>