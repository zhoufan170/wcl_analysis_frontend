<template>
    <div class="app-container">
        <el-card>
            <span style="color:red; text-align: center; display:block; font-size:20px"> 多boss自然防护药水检测 </span>
        </el-card>
        <el-card v-if="bossNatureProtectionData.length==0">
            <span style="color:blue; text-align: center; display:block; font-size:15px"> 该日志小软/公主/奥罗/克苏恩的战斗记录 </span>
        </el-card>
        <el-card>
            <el-collapse accordion>
                <el-collapse-item v-for="data in bossNatureProtectionData" :key="data.fight_id" :title="data.title" :name="data.fight_id">
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
                        <el-table-column label="自然防护药水治疗量" align="center" width="230">
                            <template slot-scope="{row}">
                                <span>{{ row.nature_protection_absorb }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="自然防护药水战斗中使用次数" align="center" width="230">
                            <template slot-scope="{row}">
                                <span>{{ row.nature_protection_cast }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="强效自然防护药水治疗量" align="center" width="240">
                            <template slot-scope="{row}">
                                <span>{{ row.major_nature_protection_absorb }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="强效果自然防护药水战斗中使用次数" align="center" width="250">
                            <template slot-scope="{row}">
                                <span>{{ row.major_nature_protection_cast }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
        </el-card>
    </div>
</template>>

<script>
import { BossNatureProtection } from '@/api/wcl-backend'

export default {
    name: 'Viscidus Poison Tick',
    data() {
        return {
            query: {},
            bossNatureProtectionData: [],
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
        this.GetbossBatureProtectionData(this.log_id)
    },
    methods: {
        GetbossBatureProtectionData(log_id) {
            this.query = {"id": log_id}
            BossNatureProtection(this.query).then(response => {
                if (response.code == 20000) {
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].kill == true){
                            response.data[i]["title"] = response.data[i].fight_name + ' 战斗编号:' + response.data[i].fight_id + ' 击杀成功'
                        }
                        else {
                            response.data[i]["title"] = response.data[i].fight_name + ' 战斗编号:' + response.data[i].fight_id + ' 击杀失败'
                        }
                        this.bossNatureProtectionData.push(response.data[i])
                    }
                    console.log(this.bossNatureProtectionData)
                }
                
                setTimeout(() => {
                    this.listLoading = false
                }, 1.5 * 1000)
            }
            )
        },
        cellStyle(row){
            if (row.row.importance == 'L3') {
                return 'background:green;font-weight:bold;color:blue;'
            }
            else if (row.row.importance == 'L2') {
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