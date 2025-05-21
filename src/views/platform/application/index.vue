<template>
  <div class="p-4">
    <!-- 顶部工具栏 -->
    <el-row class="mb-4" justify="space-between">
      <el-col :span="12">
        <el-button type="primary" @click="handleAdd"> 新增客户端 </el-button>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-input
          v-model="applicationName"
          v-optimize="{ event: 'input', fn: handleSearch, timeout: 400 }"
          placeholder="请输入名称搜索"
          clearable
          style="max-width: 240px"
          @clear="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </el-col>
    </el-row>

    <!-- 卡片列表 -->
    <el-row :gutter="16">
      <template v-if="list.length > 0">
        <el-col
          v-for="item in list"
          :key="item.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="mb-4"
        >
          <el-card
            shadow="hover"
            class="card-item"
            @click="goToDetail(item.id)"
          >
            <div class="flex items-start space-x-4">
              <el-image
                :src="item.clientLogo"
                fit="cover"
                class="logo"
                :preview-src-list="[item.clientLogo]"
                :preview-teleported="true"
              />
              <div class="flex-1">
                <h3 class="font-semibold text-base mb-1 truncate">
                  {{ item.clientName }}
                </h3>
                <p class="text-xs text-gray-500 mb-1">
                  {{ formatDate(item.createTime) }}
                </p>
                <p class="text-sm text-gray-600 line-clamp-2">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </el-card>
        </el-col>
      </template>

      <!-- 骨架屏 -->
      <template v-else-if="loading">
        <el-col
          v-for="n in pageSize"
          :key="'skeleton-' + n"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="mb-4"
        >
          <el-card class="card-item">
            <div class="flex items-start space-x-4">
              <el-skeleton style="width: 56px; height: 56px" animated />
              <div class="flex-1">
                <el-skeleton :rows="3" animated />
              </div>
            </div>
          </el-card>
        </el-col>
      </template>
    </el-row>

    <!-- 触发器 -->
    <div ref="loadMoreTrigger" class="h-10" />

    <!-- 加载提示 -->
    <div
      v-if="loading && list.length > 0"
      class="text-center py-4 text-gray-500 text-sm"
    >
      加载中...
    </div>
    <div
      v-if="finished && list.length > 0"
      class="text-center py-4 text-gray-400 text-sm"
    >
      已加载全部数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { cardListPage } from "@/api/application";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { Search } from "@element-plus/icons-vue";

const list = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = 12;
const total = ref(0);
const loading = ref(false);
const finished = ref(false);
const applicationName = ref("");

const loadMoreTrigger = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const router = useRouter();

const goToDetail = (id: string | number) => {
  router.push({ name: "ApplicationDetails", query: { id } });
};

const handleAdd = () => {
  router.push({ name: "ApplicationCreate" }); // 确保你的路由中存在此名称
};

const fetchData = async (reset = false) => {
  if (loading.value || (finished.value && !reset)) return;

  if (reset) {
    list.value = [];
    currentPage.value = 1;
    finished.value = false;
  }

  loading.value = true;
  try {
    const res = await cardListPage({
      current: currentPage.value,
      size: pageSize,
      applicationName: applicationName.value.trim() || undefined
    });

    if (res.data) {
      const records = res.data.records || [];
      total.value = Number(res.data.total || 0);
      list.value.push(...records);

      if (list.value.length >= total.value) {
        finished.value = true;
      } else {
        currentPage.value++;
      }
    }
  } catch (err) {
    console.error("数据加载失败", err);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  fetchData(true);
};

const observeTrigger = () => {
  if (!loadMoreTrigger.value) return;

  observer = new IntersectionObserver(entries => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      fetchData();
    }
  });

  observer.observe(loadMoreTrigger.value);
};

onMounted(() => {
  fetchData();
  observeTrigger();
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
};
</script>

<style scoped>
.logo {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
}

.card-item {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.2s ease;
  border-radius: 12px;
}
.card-item:hover {
  transform: translateY(-2px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
