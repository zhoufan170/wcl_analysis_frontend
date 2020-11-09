/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const logManageRouter = {
    path: '/log-manage',
    component: Layout,
    children: [
        {
            path: 'index',
            component: () => import('@/views/log-manage/index'),
            name: 'Log manage',
            meta: { title: '日志管理', icon: 'form' }
        },
        {
            path: '/log-manage/:log_id/details',
            component: () => import('@/views/log-detail/details'),
            name: 'Log details',
            meta: { title: '日志详情'},
            hidden: true
        },
        {
            path: '/log-manage/:log_id/viscidus_poison_tick',
            component: () => import('@/views/log-detail/taq/viscidus_poison_tick'),
            name: 'Viscidus Poison Tick',
            meta: { title: '维度希斯毒箭伤害统计'},
            hidden: true
        },
        {
            path: '/log-manage/:log_id/boss_nature_protection',
            component: () => import('@/views/log-detail/taq/boss_nature_protection'),
            name: 'Boss Nature Protection',
            meta: { title: '多boss自然防护检测'},
            hidden: true
        }
    ]
}
export default logManageRouter
