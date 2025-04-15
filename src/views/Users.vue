<template>
    <div class="user-management-container">
        <div class="user-management-header">
            <h2 class="section-title">用户管理列表</h2>
        </div>

        <div class="table-operations">
            <el-button type="primary" size="small" @click="handleAdd">
                <el-icon><Plus /></el-icon> 新增
            </el-button>

            <div class="search-box">
                <el-input
                    v-model="searchQuery"
                    placeholder="输入关键词"
                    prefix-icon="Search"
                    clearable
                    @clear="loadUserData"
                    @keyup.enter="handleSearch"
                />
                <el-button type="primary" @click="handleSearch">搜索</el-button>
            </div>
        </div>

        <!-- Desktop Table (shows on screens larger than 800px) -->
        <div v-if="!isMobileView" class="desktop-table-container">
            <el-table
                :data="userData"
                border
                stripe
                :header-cell-style="headerCellStyle"
                :cell-style="cellStyle"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column
                    label="序号"
                    type="index"
                    width="70"
                    align="center"
                />
                <el-table-column
                    prop="date"
                    label="日期"
                    min-width="160"
                    align="center"
                />
                <el-table-column
                    prop="name"
                    label="姓名"
                    min-width="100"
                    align="center"
                />
                <el-table-column
                    prop="city"
                    label="城市"
                    min-width="80"
                    align="center"
                />
                <el-table-column
                    prop="area"
                    label="地区"
                    min-width="80"
                    align="center"
                />
                <el-table-column
                    prop="address"
                    label="地址"
                    min-width="250"
                    align="center"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="zip"
                    label="邮编"
                    min-width="100"
                    align="center"
                />
                <el-table-column label="操作" min-width="120" align="center">
                    <template #default="scope">
                        <el-button
                            size="small"
                            type="primary"
                            @click="handleEdit(scope.row)"
                            text
                            >编辑</el-button
                        >
                        <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.row)"
                            text
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- Mobile View (shows on screens smaller than 800px) -->
        <div v-else class="mobile-table-view">
            <div
                v-for="(user, index) in userData"
                :key="user.id"
                class="mobile-card"
            >
                <div class="mobile-card-header">
                    <span class="mobile-card-index">{{
                        (currentPage - 1) * pageSize + index + 1
                    }}</span>
                    <span class="mobile-card-name">{{ user.name }}</span>
                </div>
                <div class="mobile-card-content">
                    <div class="mobile-card-item">
                        <span class="mobile-item-label">日期:</span>
                        <span class="mobile-item-value">{{ user.date }}</span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-item-label">城市:</span>
                        <span class="mobile-item-value">{{ user.city }}</span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-item-label">地区:</span>
                        <span class="mobile-item-value">{{ user.area }}</span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-item-label">地址:</span>
                        <span class="mobile-item-value">{{
                            user.address
                        }}</span>
                    </div>
                    <div class="mobile-card-item">
                        <span class="mobile-item-label">邮编:</span>
                        <span class="mobile-item-value">{{ user.zip }}</span>
                    </div>
                </div>
                <div class="mobile-card-actions">
                    <el-button
                        size="small"
                        type="primary"
                        @click="handleEdit(user)"
                        >编辑</el-button
                    >
                    <el-button
                        size="small"
                        type="danger"
                        @click="handleDelete(user)"
                        >删除</el-button
                    >
                </div>
            </div>
        </div>

        <div class="pagination-container">
            <span class="pagination-info"
                >共 {{ total }} 条，每页 {{ pageSize }}/页</span
            >
            <el-pagination
                :current-page="currentPage"
                :page-size="pageSize"
                :page-sizes="[5, 10, 20, 50]"
                layout="prev, pager, next, jumper, sizes"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                @update:current-page="currentPage = $event"
                @update:page-size="pageSize = $event"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 模拟数据
const mockUserData = [
    {
        id: 1,
        date: '2016-05-03 08:00:00',
        name: '王小虎',
        city: '上海',
        area: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: '200333'
    },
    {
        id: 2,
        date: '2016-05-03 08:00:00',
        name: '张小虎',
        city: '上海',
        area: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: '200333'
    },
    {
        id: 3,
        date: '2016-05-03 08:00:00',
        name: '刘小虎',
        city: '上海',
        area: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: '200333'
    },
    {
        id: 4,
        date: '2016-05-03 08:00:00',
        name: '李小虎',
        city: '上海',
        area: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: '200333'
    },
    {
        id: 5,
        date: '2016-05-03 08:00:00',
        name: '赵小虎',
        city: '上海',
        area: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: '200333'
    },
    {
        id: 6,
        date: '2016-05-03 08:00:00',
        name: '杨小虎',
        city: '上海',
        area: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: '200333'
    },
    {
        id: 7,
        date: '2016-05-03 08:00:00',
        name: '周小虎',
        city: '上海',
        area: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: '200333'
    }
]

// 状态变量
const userData = ref([])
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
const searchQuery = ref('')
const isMobileView = ref(false)
let resizeObserver = null

// 防抖函数
function debounce(fn, delay) {
    let timer = null
    return function () {
        const context = this
        const args = arguments
        clearTimeout(timer)
        timer = setTimeout(function () {
            fn.apply(context, args)
        }, delay)
    }
}

// 响应式检测屏幕宽度 (使用防抖)
const checkScreenSize = debounce(() => {
    isMobileView.value = window.innerWidth < 1200
}, 50)

// 添加事件监听器
onMounted(() => {
    loadUserData()

    // 初始化视图模式
    isMobileView.value = window.innerWidth < 1200

    // 使用 RAF 方式优化 ResizeObserver
    if (typeof window !== 'undefined') {
        let rafId = null
        const handleResize = () => {
            if (rafId) {
                cancelAnimationFrame(rafId)
            }
            rafId = requestAnimationFrame(() => {
                checkScreenSize()
                rafId = null
            })
        }

        window.addEventListener('resize', handleResize)

        // 使用 onUnmounted 代替 return 闭包函数
        onUnmounted(() => {
            window.removeEventListener('resize', handleResize)
            if (rafId) {
                cancelAnimationFrame(rafId)
            }
        })
    }
})

// 设置表格样式，根据当前主题
const headerCellStyle = computed(() => {
    return {
        backgroundColor: 'var(--nav-active)',
        color: 'var(--text-primary)',
        fontWeight: 'bold',
        borderColor: 'var(--border-color)'
    }
})

const cellStyle = computed(() => {
    return {
        backgroundColor: 'var(--card-bg)',
        color: 'var(--text-primary)',
        borderColor: 'var(--border-color)'
    }
})

// 加载用户数据
const loadUserData = () => {
    // 模拟后端分页和搜索
    const filteredData = searchQuery.value
        ? mockUserData.filter(user =>
              Object.values(user).some(val =>
                  val
                      .toString()
                      .toLowerCase()
                      .includes(searchQuery.value.toLowerCase())
              )
          )
        : [...mockUserData]

    total.value = filteredData.length

    // 分页处理
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    userData.value = filteredData.slice(startIndex, endIndex)
}

// 事件处理
const handleAdd = () => {
    ElMessage.info('新增用户功能')
}

const handleEdit = row => {
    ElMessage.info(`编辑用户: ${row.name}`)
}

const handleDelete = row => {
    ElMessageBox.confirm(`确定要删除用户 ${row.name} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            // 模拟删除
            const index = mockUserData.findIndex(user => user.id === row.id)
            if (index !== -1) {
                mockUserData.splice(index, 1)
                loadUserData()
                ElMessage.success('删除成功')
            }
        })
        .catch(() => {
            ElMessage.info('已取消删除')
        })
}

const handleSearch = () => {
    currentPage.value = 1 // 重置到第一页
    loadUserData()
}

const handleSizeChange = val => {
    pageSize.value = val
    loadUserData()
}

const handleCurrentChange = val => {
    currentPage.value = val
    loadUserData()
}
</script>

<style scoped>
.user-management-container {
    background-color: var(--card-bg);
    /* border-radius: 8px; */
    padding: 20px;
    /* box-shadow: var(--box-shadow); */
    width: 80%;
    min-height: 100vh;
    margin: 0 auto;
    margin-top: 60px;
    overflow-x: auto;
    transition: all 0.3s ease-in-out; /* 添加布局过渡效果 */
    will-change: transform, width, height; /* 提示浏览器优化属性变化 */
    transform: translateZ(0); /* 强制硬件加速 */
}

.user-management-header {
    margin-bottom: 20px;
    text-align: center;
}

.section-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--section-title-color);
    margin-bottom: 16px;
    text-align: left;
    padding-left: 4px;
    border-left: 4px solid var(--section-title-border);
    padding-left: 12px;
    transition: color 0.3s ease, border-left 0.3s ease;
}

.table-operations {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    align-items: center;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 10px;
}

.desktop-table-container {
    width: 100%;
    overflow-x: auto; /* 允许在桌面视图中水平滚动 */
}

.pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pagination-info {
    color: var(--text-secondary);
    font-size: 14px;
}

/* 移动视图样式 */
.mobile-table-view {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
}

.mobile-card {
    background-color: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    overflow: hidden;
}

.mobile-card-header {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: var(--nav-active);
    color: var(--text-primary);
}

.mobile-card-index {
    background-color: var(--primary-color, #409eff);
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-size: 12px;
}

.mobile-card-name {
    font-weight: bold;
    flex-grow: 1;
}

.mobile-card-content {
    padding: 10px;
}

.mobile-card-item {
    display: flex;
    margin-bottom: 8px;
    align-items: baseline;
}

.mobile-item-label {
    min-width: 60px;
    font-weight: 500;
    color: var(--text-secondary);
}

.mobile-item-value {
    color: var(--text-primary);
    word-break: break-word;
}

.mobile-card-actions {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    gap: 10px;
    border-top: 1px solid var(--border-color);
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
    background-color: var(--card-bg);
}

:deep(.el-input__inner),
:deep(.el-select__placeholder span) {
    color: var(--text-primary) !important;
}

/* 锁定操作按钮的父容器 */
:deep(.el-table__body-wrapper tr td:last-child .cell) {
    min-width: 120px !important;
    max-width: 120px !important;
}

/* 操作按钮固定尺寸 */
:deep(.el-table__row .el-button--small) {
    width: 40px;
    flex-shrink: 0; /* 禁止内容变化缩小 */
    /* margin-right: 20px; */
}

/* 隐藏可能的弹出层影响 */
:deep(.el-tooltip__popper) {
    display: none !important;
}

/* 适配深色模式的额外样式 */
/* Add these styles to your <style scoped> section */

/* Table outer borders */
:deep(.el-table) {
    border-color: var(--border-color) !important;
}

:deep(.el-table--border) {
    border-color: var(--border-color) !important;
}

/* Table cell borders */
:deep(.el-table td.el-table__cell),
:deep(.el-table th.el-table__cell.is-leaf) {
    border-color: var(--border-color) !important;
}

/* Table border lines */
:deep(.el-table--border::after),
:deep(.el-table--border::before),
:deep(.el-table__inner-wrapper::before) {
    background-color: var(--border-color) !important;
}

/* Fixed columns borders */
:deep(.el-table__fixed-right::before),
:deep(.el-table__fixed::before) {
    background-color: var(--border-color) !important;
}

/* Border patches */
:deep(.el-table__border-left-patch),
:deep(.el-table__fixed-right-patch) {
    background-color: var(--border-color) !important;
}

/* Footer borders if you have them */
:deep(.el-table__footer-wrapper tbody td.el-table__cell) {
    border-color: var(--border-color) !important;
}

/* Header borders when sticky */
:deep(.el-table.is-scrolling-left .el-table__fixed-right.has-gutter),
:deep(.el-table.is-scrolling-right .el-table__fixed.has-gutter) {
    border-color: var(--border-color) !important;
}

/* Additional vertical borders */
:deep(.el-table .el-table__cell) {
    border-right-color: var(--border-color) !important;
}

/* Append slot borders if you use them */
:deep(.el-table__append-wrapper) {
    border-color: var(--border-color) !important;
}

:deep(.el-table th.el-table__cell) {
    background-color: var(--nav-active) !important;
    color: var(--text-primary) !important;
    border-color: var(--border-color) !important;
}

:deep(.el-table td.el-table__cell) {
    background-color: var(--card-bg) !important;
    color: var(--text-primary) !important;
    border-color: var(--border-color) !important;
}

:deep(
        .el-table--striped
            .el-table__body
            tr.el-table__row--striped
            td.el-table__cell
    ) {
    background-color: var(--nav-hover) !important;
}

:deep(.el-table__row) {
    height: 60px;
}

:deep(.el-table__body tr:hover td.el-table__cell) {
    background-color: var(--nav-hover) !important;
}

:deep(.el-pagination) {
    --el-pagination-font-size: 14px;
    --el-pagination-bg-color: transparent;
    --el-pagination-text-color: var(--text-secondary);
    --el-pagination-button-color: var(--text-secondary);
    --el-pagination-hover-color: var(--calendar-today-color);
    --el-pagination-button-bg-color: var(--card-bg);
    --el-pagination-button-disabled-color: var(--text-tertiary);
    --el-pagination-button-disabled-bg-color: var(--card-bg);
    --el-pagination-hover-bg-color: var(--nav-hover);
}

:deep(.el-table) {
    --el-table-border-color: var(--border-color) !important;
    --el-table-header-border-color: var(--border-color) !important;
    --el-table-border: 1px solid var(--border-color) !important;
    --el-table-cell-border-color: var(--border-color) !important;
}

/* Force override with !important for all possible table elements */
:deep(.el-table),
:deep(.el-table__inner-wrapper),
:deep(.el-table__header-wrapper),
:deep(.el-table__body-wrapper),
:deep(.el-table__footer-wrapper),
:deep(.el-table__header),
:deep(.el-table__body),
:deep(.el-table__footer),
:deep(.el-table__cell),
:deep(.el-table th.el-table__cell),
:deep(.el-table td.el-table__cell),
:deep(.el-table .el-table__cell.is-leaf),
:deep(.el-table--border),
:deep(.el-table--group) {
    border-color: var(--border-color) !important;
}

/* Target horizontal and vertical divider lines */
:deep(.el-table::before),
:deep(.el-table::after),
:deep(.el-table__inner-wrapper::before),
:deep(.el-table__inner-wrapper::after),
:deep(.el-table--border::before),
:deep(.el-table--border::after) {
    background-color: var(--border-color) !important;
}

/* Ensure the top edge of the table is correctly colored */
:deep(.el-table__header-wrapper tr:first-child th.el-table__cell) {
    border-top-color: var(--border-color) !important;
}

/* 响应式样式 */
@media (max-width: 800px) {
    .user-management-container {
        padding: 15px;
    }

    .table-operations {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }

    .search-box {
        width: 100%;
    }

    .search-box .el-input {
        flex-grow: 1;
    }

    .pagination-container {
        flex-direction: column;
        gap: 10px;
    }

    .pagination-info {
        text-align: center;
    }

    :deep(.el-pagination) {
        width: 100%;
        justify-content: center;
    }

    :deep(.el-button) {
        height: 30px;
        font-size: 14px;
    }

    .section-title {
        text-align: center;
        border: none;
    }
}
</style>
