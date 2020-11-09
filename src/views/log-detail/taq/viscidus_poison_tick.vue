<template>
    <div class="app-container">
        <el-card>
            <span style="color:red; text-align: center; display:block; font-size:20px"> 小软毒箭伤害排名 </span>
        </el-card>
        <el-card v-if="viscidusPosionTickData.length==0">
            <span style="color:blue; text-align: center; display:block; font-size:15px"> 该日志没有小软的战斗记录 </span>
        </el-card>
        <el-card>
            <el-collapse accordion>
                <el-collapse-item v-for="data in viscidusPosionTickData" :key="data.fight_id" :title="data.title" :name="data.fight_id">
                    <el-table
                        :key="data.fight_id"
                        v-loading="listLoading"
                        :element-loading-text="loadingtext"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"
                        :data="data.detail"
                        border
                        fit
                        :cell-style="cellStyle"
                        highlight-current-row
                        style="width: 100%">
                        <el-table-column label="ID" align="center" width="200">
                            <template slot-scope="{row}">
                                <span>{{ row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="毒箭伤害量" align="center" width="230">
                            <template slot-scope="{row}">
                                <span>{{ row.damage }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="被击中" align="center" width="230">
                            <template slot-scope="{row}">
                                <span>{{ row.hit }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="dot生效次数" align="center" width="240">
                            <template slot-scope="{row}">
                                <span>{{ row.tick }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="dot uptime" align="center" width="250">
                            <template slot-scope="{row}">
                                <span>{{ row.uptime }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
        </el-card>
    </div>
</template>>

<script>
import { ViscidusPosionTickInfo } from '@/api/wcl-backend'

export default {
    name: 'Viscidus Poison Tick',
    data() {
        return {
            query: {},
            viscidusPosionTickData: [],
            listLoading: true,
            loadingtext: '拼命加载中，祝大哥天天小红手，WCL登顶',
        }
    },
    computed: {
        log_id() {
            console.log(this.$route.params.log_id)
            return this.$route.params.log_id       
        }
    },
    created() {
        this.GetViscidusPosionTickData(this.log_id)
    },
    methods: {
        GetViscidusPosionTickData(log_id) {
            this.query = {"id": log_id}
            ViscidusPosionTickInfo(this.query).then(response => {
                if (response.code == 20000) {
                    for (var i = 0; i < response.data.length; i++) {
                        console.log(response.data.length)
                        if (response.data[i].kill == true){
                            response.data[i]["title"] = response.data[i].fight_name + ' 战斗编号:' + response.data[i].fight_id + ' 击杀成功'
                        }
                        else {
                            response.data[i]["title"] = response.data[i].fight_name + ' 战斗编号:' + response.data[i].fight_id + ' 击杀失败'
                        }
                        this.viscidusPosionTickData.push(response.data[i])
                    }
                    console.log('1111')
                    console.log(this.viscidusPosionTickData)
                    console.log('2222')
                }
                //console.log(response.data)
                
                setTimeout(() => {
                    this.listLoading = false
                }, 1.5 * 1000)
            }
            )
        },
        cellStyle(row){
            if (row.row.tick < 5) {
                return 'background:green;font-weight:bold;color:blue;'
            }
            else if (row.row.tick < 10) {
                return 'background:yellow;font-weight:bold;color:blue;'
            }
            else {
                return 'background:red;font-weight:bold;color:blue;'
            }
        }
    }
}
</script>
</script>
<style lang='css'>
.el-collapse-item__header {
    font-size: 20px;
}
</style>