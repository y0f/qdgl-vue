<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px;float:right;">
      <el-input v-model="search" placeholder="搜索" style="width: 200px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 10px;" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item el-icon-circle-plus-outline" style="margin-left: 10px;" type="primary" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column label="学号" align="center">
        <template slot-scope="scope">
          {{ scope.row.stu_id }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="所属部门" align="center">
        <template slot-scope="scope">
          {{ scope.row.classes.class_name }}
        </template>
      </el-table-column>
      <el-table-column label="微信ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.wx_id }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.create_time }}
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.update_time }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="float: right" @pagination="getUserList" />

    <!--添加、修改提示框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 500px; margin-left:50px;">
        <el-form-item label="学号" prop="stu_id">
        <el-input v-model="temp.stu_id" />
      </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="所属部门" prop="class_id">
          <el-select v-model="temp.class_id" class="filter-item" placeholder="请选择部门">
            <el-option v-for="item in class_list" :key="item.id" :label="item.class_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password" type="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="微信ID" prop="password" type="password">
          <el-input v-model="temp.wx_id" />
        </el-form-item>
<!--        <el-form-item label="Date" prop="timestamp">-->
<!--          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
<!--        </el-form-item>-->

<!--        <el-form-item label="Status">-->
<!--          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">-->
<!--            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="Imp">-->
<!--          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="Remark">-->
<!--          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getUserList, createUser, updateUser, deleteUser, filter } from '@/api/user'
import { getClassesList } from '@/api/classes'
import Pagination from '@/components/Pagination'
export default {
  inject: ['reload'],
  data() {
    return {
      list: null,
      class_list: null,
      total: 0,
      search: '',
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
        stu_id: [{ required: true, message: '请输入学号', trigger: 'change' }],
        // password: [{ required: true, message: '请输入密码', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      calendarTypeOptions: undefined,
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        // id: undefined,
        // importance: 1,
        // remark: '',
        // timestamp: new Date(),
        // title: '',
        // type: '',
        // status: 'published'
        stu_id: undefined,
        username: '',
        class_id: undefined,
        password: ''
      },
      listQuery: {
        page: 1,
        limit: 10,
        username: undefined,
        stu_id: undefined
      },
    }
  },
  created() {
    this.getUserList()
  },
  components: {
    Pagination
  },
  methods: {
    getUserList() {
      getUserList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
      })
    },
    resetTemp() {
      this.temp = {
        // id: undefined,
        // importance: 1,
        // remark: '',
        // timestamp: new Date(),
        // title: '',
        // status: 'published',
        // type: ''
        stu_id: undefined,
        username: '',
        class_id: undefined,
        password: '',
        wx_id: '',
        uid: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      getClassesList().then(response =>{
        console.log(response.data)
        this.class_list = response.data
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      getClassesList().then(response =>{
        console.log(response.data)
        this.class_list = response.data
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      this.$confirm('确认是否删除?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteUser(row.uid).then(response =>{
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      })
    },
    handleFilter() {
      if(this.search == ''){
        this.$notify({
          title: '错误',
          message: '请输入搜索内容',
          type: 'error',
          duration: 2000
        })
      }else{
        filter(this.search).then(response => {
          this.handleUpdate(response.data)
        })
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          createUser(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.reload()
            this.$notify({
              title: '成功',
              message: '创建成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
          console.log(this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(this.temp.uid, this.temp).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.reload()
            this.$notify({
              title: '成功',
              message: '更新成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
  }
}
</script>
