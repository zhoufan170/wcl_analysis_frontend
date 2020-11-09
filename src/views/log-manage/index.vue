<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.code" placeholder="code" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.raid" placeholder="副本" clearable style="width: 90px" class="filter-item">
        <el-option v-for="raid in raidType" :key="raid" :label="raid" :value="raid" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-circle-plus" @click="handleNewLog">
        上传新日志
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :element-loading-text="loadingtext"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志code" width="250px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="副本" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.raid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志标题" width="250px">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="副本用时" width="175px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="副本日期" width="175px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详情页" width="133px" align="left">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="RedirectLogDetail(row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="副本:" prop="raid">
          <el-select v-model="temp.raid" class="filter-item" placeholder="选择副本">
            <el-option v-for="raid in raidType" :key="raid" :label="raid" :value="raid" />
          </el-select>
        </el-form-item>
        <el-form-item label="code:" prop="code">
          <el-input v-model="temp.code" style="width: 400px" placeholder="请粘贴wcl链接里一段代码，类似于hcDHQmbx17gyYPKB"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="LoadNewLog()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="per_page" @pagination="getList" />
  </div>
</template>

<script>
import { GetWclLogList, LoadNewWCLLog } from '@/api/wcl-backend'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name: 'LogList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      code: 0,
      total: 0,
      per_page: 10,
      listLoading: true,
      loadingtext: '拼命加载中，祝大哥天天小红手，WCL登顶',
      url: 'http://localhost:9527',
      listQuery: {
        page: 1,
        per_page: 10
      },
      new_log_post_date: {},
      raidType: ['TAQ', 'NAXX'],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      temp: {
        code: '',
        raid: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        raid: [{ required: true, message: '副本必选', trigger: 'change' }],
        code: [{ required: true, message: 'code必输', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      GetWclLogList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        console.log(this.list)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 3 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleNewLog() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    RedirectLogDetail(row){
      console.log(this.url)
      this.$router.push('/log-manage/' + row.id + '/details')
    },
    LoadNewLog() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          this.new_log_post_date = {
            "code": this.temp.code,
            "raid": this.temp.raid
          }
          LoadNewWCLLog(this.temp).then(response => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            if (response.code == 20000)
            {
              this.$notify({
                title: 'Success',
                message: '上传新日志成功',
                type: 'success',
                duration: 2000
              })
            }
            else
            {
              this.$notify({
                title: 'Fail',
                message: response.message,
                type: 'error',
                duration: 2000
              })
            }
            GetWclLogList(this.listQuery).then(response => {
              this.list = response.data.data
              this.total = response.data.total
              console.log(this.list)
              // Just to simulate the time of the request
              setTimeout(() => {
                this.listLoading = false
                }, 0.5 * 1000)
              })
            // window.location.reload()  
          })
        }
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
