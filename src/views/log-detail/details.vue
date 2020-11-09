<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span style="color:red; text-align: center; display:block; font-size:20px">{{ logInfo.title }}</span>
      </div>
    
    <el-form label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="副本:">
            <span style="font-size:16px; border:1">{{ logInfo.raid }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="WCL code:">
            <span style="font-size:16px; border:1">{{ logInfo.code }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="日志所有者:">
            <span style="font-size:16px; border:1">{{ logInfo.owner }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="副本用时:">
            <span style="font-size:16px; border:1">{{ logInfo.total }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="WCL链接:">
            <a href="" style="font-size:16px; border:1">{{ logInfo.wcl_link }}</a>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          
        </el-col>
      </el-row>
    </el-form>
    </el-card>
    <el-card>
        <el-button v-show="analysisButtonShow" type="warning" style="margin: 10px 10px;" @click="LogAnalysis()">
            日志分析
          </el-button>
    <el-progress v-show="progressShow" :percentage="percentage" :stroke-width="10" :status="progressStatus"></el-progress>
    </el-card>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :element-loading-text="loadingtext"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="scanList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="项目" align="left" width="400">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务运行状态" align="center" width="400">
        <template slot-scope="{row}">
          <span v-if="row.scan_flag==0" style="color:red">未分析</span>
          <span v-if="row.scan_flag==1" style="color:blue">已分析</span>
          <span v-if="row.scan_flag!=0 && row.scan_flag!=1" style="color:green">分析中</span>
        </template>
      </el-table-column>
      <el-table-column label="分析结果" align="center" width="388">
        <template slot-scope="{row}">
          <el-button v-if="row.scan_flag==1" type="primary" size="mini" :disabled=false @click="RedirectInfo(row)">
            查看详情
          </el-button>
          <el-button v-if="row.scan_flag!=1" type="primary" size="mini" :disabled=true @click="RedirectInfo(row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GetLogDetail, RunTask } from '@/api/wcl-backend'
import settings from '@/store/modules/settings'

export default {
    name: "LogDetail",
    data() {
      return {
        tableKey: 0,
        percentage: 0,
        listLoading: true,
        progressShow: true,
        progressStatus: "",
        finish_task_num: 0,
        analysisButtonShow: true,
        total_task_num: 0,
        loadingtext: '拼命加载中，祝大哥天天小红手，WCL登顶',
        detailParams: {
            id: this.log_id
        },
        logInfo: {},
        scanList: [],
        query: {},
        postData: {}
      }
    },
    computed: {
      log_id() {
        console.log(this.$route.params.log_id)
        return this.$route.params.log_id       
      }
    },
    created() {
      this.GetLogRaid(this.log_id)
      this.GetTaskPercent(this.log_id)
    },
    watch: {
        analysisButtonShow: function(){
            console.log('watch begin')
            var interval = setInterval( () => {
                GetLogDetail(this.query).then(response => {
                    this.scanList = []
                    for (var i = 0; i < response.data.scan_list.length; i++){
                        const tempdata = {}
                        tempdata['type'] = response.data.scan_list[i].type
                        tempdata['name'] = response.data.scan_list[i].name
                        tempdata['scan_flag'] = response.data.scan_list[i].scan_flag
                        this.scanList.push(tempdata)
                    }
                    this.finish_task_num = 0
                    this.total_task_num = 0
                    for (var i = 0; i < response.data.scan_list.length; i++) {
                        if (response.data.scan_list[i].scan_flag == 1) {
                            this.finish_task_num = this.finish_task_num + 1
                            this.total_task_num = this.total_task_num + 1
                        }
                        else {
                            this.total_task_num = this.total_task_num + 1
                        }
                    }
                    this.percentage = (this.finish_task_num / this.total_task_num) * 100
                    if (this.percentage >= 100) {
                        this.analysisButtonShow = false
                        this.progressStatus = 'success'
                        console.log('watch end')
                        clearInterval(interval)
                    }          
                }
                )
            }, 2000)
        }
    },
    methods: {
      GetLogRaid(log_id) {
        this.query = {"id": log_id}
        GetLogDetail(this.query).then(response => {
            this.scanList = []
            for (var i = 0; i < response.data.scan_list.length; i++){
                const tempdata = {}
                tempdata['type'] = response.data.scan_list[i].type
                tempdata['name'] = response.data.scan_list[i].name
                tempdata['scan_flag'] = response.data.scan_list[i].scan_flag
                this.scanList.push(tempdata)
                console.log(tempdata)
            }
            this.logInfo = {
                "title": response.data.title,
                "raid": response.data.raid,
                "code": response.data.code,
                "owner": response.data.owner,
                "total": response.data.total,
                "wcl_link": response.data.wcl_link,
            }
            console.log(this.logInfo)
            setTimeout(() => {
                this.listLoading = false
            }, 1.5 * 1000)
        })
      },
      GetTaskPercent(log_id) {
          this.query = {"id": log_id}
          GetLogDetail(this.query).then(response => {
              this.finish_task_num = 0
              this.total_task_num = 0
              for (var i = 0; i < response.data.scan_list.length; i++) {
                  if (response.data.scan_list[i].scan_flag == 1) {
                      this.finish_task_num = this.finish_task_num + 1
                      this.total_task_num = this.total_task_num + 1
                  }
                  else {
                      this.total_task_num = this.total_task_num + 1
                  }
              }
              this.percentage = (this.finish_task_num / this.total_task_num) * 100
              if (this.percentage >= 100) {
                  this.analysisButtonShow = false
                  this.progressStatus = 'success'
              }
              else {
                  this.analysisButtonShow = true
              }
              console.log('当前完成' + this.percentage)
              setTimeout(() => {
                this.listLoading = false
              }, 0.5 * 1000)              
          }
          )
      },
      LogAnalysis() {
          this.postData = {"id": this.log_id}
          console.log(this.postData)
          RunTask(this.postData).then(response => {
              if (response.code == 20000){
                  this.analysisButtonShow = false
                  console.log('开始运行任务')
                  this.$message(
                      {
                          message: '开始运行任务',
                          type: 'success'
                      }
                  )
              }             
          }
          )
             
      },
      RedirectInfo(row){
          console.log(row.type)
          this.$router.push('/log-manage/' + this.log_id + '/' + row.type)
      },
    }
}
</script>