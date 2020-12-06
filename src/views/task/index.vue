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
      <el-table-column label="学期" align="center">
        <template slot-scope="scope">
          {{ scope.row.term.term_name }}
        </template>
      </el-table-column>
      <el-table-column label="课程" align="center">
        <template slot-scope="scope">
          {{ scope.row.course.course_name }}
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center">
        <template slot-scope="scope">
          {{ scope.row.user.username }}
        </template>
      </el-table-column>
      <el-table-column label="班级" align="center">
        <template slot-scope="scope">
          {{ scope.row.classes.class_name }}
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
          <el-button type="primary" size="mini" @click="handleGet(row)">
            详情
          </el-button>
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="float: right" @pagination="getTaskList" />

    <!--添加、修改提示框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 500px; margin-left:50px;">
        <el-form-item label="学期" prop="term_id">
          <el-select v-model="temp.term_id" class="filter-item" placeholder="请选择部门">
            <el-option v-for="item in term_list" :key="item.id" :label="item.term_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程" prop="term_id">
          <el-select v-model="temp.course_id" class="filter-item" placeholder="请选择部门">
            <el-option v-for="item in course_list" :key="item.id" :label="item.course_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="term_id">
          <el-select v-model="temp.class_id" class="filter-item" placeholder="请选择部门">
            <el-option v-for="item in class_list" :key="item.id" :label="item.class_name" :value="item.id" />
          </el-select>
        </el-form-item>
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

    <el-dialog :visible.sync="dialogRecordVisible" title="详情">
      <el-table :data="record_list" border fit highlight-current-row style="width: 100%">
        <el-table-column label="序号" align="center" width="95">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="签到人" align="center">
          <template slot-scope="scope">
            {{ scope.row.user.username }}
          </template>
        </el-table-column>
        <el-table-column label="签到时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.create_time }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">看完了</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { getTaskList, createTask, updateTask, deleteTask, filter } from '@/api/task'
import Pagination from '@/components/Pagination'
import { getClassesList } from '@/api/classes'
import { getCourseList } from '@/api/course'
import { getTermList } from '@/api/term'
import { getById } from '@/api/record'

export default {
  inject: ['reload'],
  data() {
    return {
      list: null,
      total: 0,
      search: '',
      term_list: undefined,
      class_list: undefined,
      course_list: undefined,
      record_list: undefined,
      dialogRecordVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        term_name: [{ required: true, message: '请输入课程名', trigger: 'change' }],
      },
      calendarTypeOptions: undefined,
      temp: {
        term_id: '',
        course_id: '',
        class_id: '',
        uid: ''
      },
      listQuery: {
        page: 1,
        limit: 10,
        term_name: '',
      },
    }
  },
  created() {
    this.getTaskList()
  },
  components: {
    Pagination
  },
  methods: {
    getTaskList() {
      getTaskList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
      })
    },
    resetTemp() {
      this.temp = {
        class_name: ''
      }
    },
    getInfoList(){
      getClassesList().then(response =>{
        console.log(response.data)
        this.class_list = response.data
      })
      getTermList().then(response =>{
        console.log(response.data)
        this.term_list = response.data.data
      })
      getCourseList().then(response =>{
        console.log(response.data)
        this.course_list = response.data.data
      })
      this.temp.uid = '5fbf97916e52f'
    },
    handleGet(row){
      this.dialogRecordVisible = true
      getById(row.id).then(response => {
        this.record_list = response.data
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getInfoList()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.getInfoList()
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
        deleteTask(row.id).then(response =>{
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
          createTask(this.temp).then(() => {
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
          console.log(this.temp)
          updateTask(this.temp.id, this.temp).then(() => {
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
