<template>
  <div class="fillContainer">
    <div>
      <el-form :inline="true" ref="add_data" class="clear-fix" :model="search_data">
        <!-- 筛选 -->
        <el-form-item label="按照时间筛选：">
          <el-date-picker
            v-model="search_data.startTime"
            type="datetime"
            placeholder="选择开始时间"
            >
          </el-date-picker>
          --
          <el-date-picker
            v-model="search_data.endTime"
            type="datetime"
            placeholder="选择结束时间"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="search" @click="handleSearch()">
            筛选
          </el-button>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button type="primary" size="small" icon="view" @click="handleAdd()">
            添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table 
        v-if="tableData.length > 0" 
        :data="tableData" 
        style="width:100%"
        border
        :default-sort="{prop: 'date', order: 'descending'}">
        <el-table-column prop="date" label="创建时间" min-width="20%" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="收支类型" align="center" min-width="8%"></el-table-column>
        <el-table-column prop="describe" label="收支描述" align="center" min-width="15%"></el-table-column>
        <el-table-column prop="income" label="收入" align="center" min-width="8%">
          <template slot-scope="scope">
            <span style="color: #00d053">{{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expend" label="支出" align="center" min-width="8%">
          <template slot-scope="scope">
            <span style="color: #f56767">{{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cash" label="账户现金" align="center" min-width="9%">
          <template slot-scope="scope">
            <span style="color: #4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" min-width="15%"></el-table-column>
        <el-table-column align="center" min-width="15%" label="操作" prop="operation">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="warning"
              icon="edit"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              icon="delete"
              v-if="user.identity !== 'employee'"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paginations.page_index"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <Dialog :dialog="dialog" :formData="formData" @update="getProfile"></Dialog>
  </div>
</template>

<script>
import Dialog from '../components/Dialog';
export default {
  name: "fund-list",
  data() {
    return {
      search_data: {
        startTime: "",
        endTime: ""
      },
      tableData: [],
      allTableData: [],
      filterTableData: [],
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 5, // 当前页显示多少条
        page_sizes: [5, 10, 20], // 每页显示多少条
        layout: "total,sizes,prev,pager,next,jumper" // 翻页属性
      },
      formData: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      },
      dialog: {
        show: false,
        title: "",
        option: "edit"
      }
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  created() {
    this.getProfile();
  },
  components: {
    Dialog
  },
  methods: {
    getProfile() {
      // 获取表格数据
      this.$axios
        .get("/api/profile")
        .then(res => {
          // 与user关联
          // this.allTableData = res.data.writeArr;
          // this.filterTableData = res.data.writeArr;
          this.allTableData = res.data;
          this.filterTableData = res.data;
          for(var i = 0; i < this.allTableData.length; i++) {
            let timeZone = new Date(this.allTableData[i].date);
            let dateObj = {
              "year": timeZone.getFullYear(),
              "month": Number(timeZone.getMonth()) + 1,
              "day": timeZone.getDate(),
              "hours": timeZone.getHours(),
              "minute": timeZone.getMinutes(),
              "second": timeZone.getSeconds()
            }
            dateObj.month = dateObj.month < 10 ? '0' + dateObj.month : dateObj.month;
            dateObj.day = dateObj.day < 10 ? '0' + dateObj.day : dateObj.day;
            dateObj.hours = dateObj.hours < 10 ? '0' + dateObj.hours : dateObj.hours;
            dateObj.minute = dateObj.minute < 10 ? '0' + dateObj.minute : dateObj.minute;
            dateObj.second = dateObj.second < 10 ? '0' + dateObj.second : dateObj.second;
            this.allTableData[i].date = `${dateObj.year}-${dateObj.month}-${dateObj.day} ${dateObj.hours}:${dateObj.minute}:${dateObj.second}`
          }
          // 设置分页数据
          this.setPaginations();
        })
        .catch(err => {
          // console.log(err);
        });
    },
    setPaginations() {
      // 分页属性设置
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      if(!this.paginations.page_size) {
        this.paginations.page_size = 5;
      }

      // 设置默认的分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      })
    },
    handleEdit(index, row) {
      // console.log("编辑");
      this.dialog = {
        show: true,
        title: "修改资金信息",
        option: "edit"
      }

      this.formData = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      }
    },
    handleDelete(index, row) {
      // console.log("删除")
      this.$axios.delete(`/api/profile/delete/${row._id}`).then(res => {
        this.$message.success("删除成功");
        this.getProfile();
      })
    },
    handleAdd() {
      // console.log("添加")
      this.dialog = {
        show: true,
        title: "添加资金信息",
        option: "add"
      }

      this.formData = {
        type: '',
        describe: '',
        income: '',
        expend: '',
        cash: '',
        remark: '',
        id: ''
      }
    },
    handleSizeChange(page_size) {
      // console.log(page_size)
      // 切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      // 设置默认的分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      })
    },
    handleCurrentChange(page) {
      // console.log(page)
      // 获取当前页
      let index = this.paginations.page_size * (page - 1);
      // 数据的总数
      let nums = this.paginations.page_size * page;
      // 容器
      let tables = [];

      for(let i = index; i < nums; i++) {
        if(this.allTableData[i]) {
          tables.push(this.allTableData[i]);
        }
        this.tableData = tables;
      }
    },
    handleSearch() {
      //筛选
      if(!this.search_data.startTime && !this.search_data.endTime) {
        this.allTableData = this.filterTableData;
        // 分页数据
        this.setPaginations();
        return;
      }
      if(!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: 'warning',
          message: "请选择完整时间区域"
        })
        return;
      }

      const sTime = this.search_data.startTime.getTime();
      const eTime = this.search_data.endTime.getTime();

      this.allTableData = this.filterTableData.filter(item => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= sTime && time <= eTime
      })

      // 分页数据
      this.setPaginations();
    }
  }
};
</script>
<style scoped>
.fillContainer {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-right: 10px;
}
</style>
