import request from '@/utils/request'

const VUE_APP_WCL_BACKEND_API = 'http://127.0.0.1:8888/'

// 获取日志列表
export function GetWclLogList(query) {
  return request({
    url: '/api/loglist',
    baseURL: VUE_APP_WCL_BACKEND_API,
    method: 'GET',
    params: query
  }
  )
}

// 上传新日志
export function LoadNewWCLLog(data) {
  return request({
    url: 'api/loglist',
    baseURL: VUE_APP_WCL_BACKEND_API,
    method: 'POST',
    data
  }
  )
}

// 查询日志明细
export function GetLogDetail(query) {
  return request({
    url: 'api/logdetail',
    baseURL: VUE_APP_WCL_BACKEND_API,
    method: 'GET',
    params: query
  }
  )
}

// 启动日志分析任务
export function RunTask(data) {
  return request({
    url: 'api/runtask',
    baseURL: VUE_APP_WCL_BACKEND_API,
    method: 'POST',
    data
  }
  )
}

// viscidus poison tick
export function ViscidusPosionTickInfo(query) {
  return request({
    url: 'api/taq/viscidus_poison_tick',
    baseURL: VUE_APP_WCL_BACKEND_API,
    method: 'GET',
    params: query
  }
  )
}

// boss nature protection
export function BossNatureProtection(query) {
  return request({
    url: 'api/taq/boss_nature_protection',
    baseURL: VUE_APP_WCL_BACKEND_API,
    method: 'GET',
    params: query
  }
  )
}