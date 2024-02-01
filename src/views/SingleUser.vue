<script setup>
import axios from 'axios'
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { VITE_API_URL } = import.meta.env

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const userData = ref({})
const dataSource = ref([])
const innerData = ref([])

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: '20%',
    sorter: {
      compare: (a, b) => a.name.localeCompare(b.name)
    }
  },
  {
    title: 'startDate',
    dataIndex: 'startDate',
    sorter: {
      compare: (a, b) => new Date(a.startDate) - new Date(b.startDate)
    }
  },
  {
    title: 'endDate',
    dataIndex: 'endDate',
    sorter: {
      compare: (a, b) => new Date(a.endDate) - new Date(b.endDate)
    }
  },
  {
    title: 'currency',
    dataIndex: 'currency',
    sorter: {
      compare: (a, b) => a.currency.localeCompare(b.currency)
    }
  },
  {
    title: 'location',
    dataIndex: 'location',
    sorter: {
      compare: (a, b) => a.location.localeCompare(b.location)
    }
  }
]

onMounted(async () => {
  await fetchuserInfo(route.params.id)
  await fetchProject(route.params.id)
})

const fetchuserInfo = async (userId) => {
  const { data } = await axios.post(`${VITE_API_URL}/userInfo`, {
    userId
  })
  console.log(data.data)
  userData.value = data.data
  loading.value = false
}

const fetchProject = async (userId) => {
  const { data } = await axios.post(`${VITE_API_URL}/userProject`, {
    userId
  })
  data.data.map((item) => {
    item.startDate = item.startDate.split('T')[0]
    item.endDate = item.endDate.split('T')[0]
  })
  console.log(data.data)
  dataSource.value = data.data
  loading.value = false
}

const fetchItemPayment = async (projectid) => {
  const { data } = await axios.post(`${VITE_API_URL}/userProject/${projectid}`, {
    userId: route.params.id
  })
  console.log('www', data.data)
  innerData.value = data.data
}

const expand = async (expanded, record) => {
  console.log(record)
  if (expanded) {
    await fetchItemPayment(record.id)
  }
}

function handleTableChange(pagination, filters, sorter, extra) {
  console.log('params', pagination, filters, sorter, extra)
}
</script>


<template>
  <div class="about">
    <template v-if="loading">
      <br />
      <br />
      <a-skeleton active />
    </template>
    <template v-else>
      <div style="width: 100%; margin">
        <h2>Name: {{ userData.name }}</h2>
        <h4>email: {{ userData.email }}</h4>
      </div>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :expand-column-width="100"
        :rowKey="(record) => record.id"
        @expand="expand"
      >
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'action'">
            <a>Delete</a>
          </template>
        </template>
        <template #expandedRowRender>
          <a-list bordered :data-source="innerData">
            <template #renderItem="{ item }">
              <a-list-item>
                <span style="color: red" v-if="item.userPayment < 0"
                  >{{ item.name }}: 應付 {{ item.userPayTo }} ${{
                    Math.abs(item.userPayment)
                  }}</span
                >
                <span style="color: green" v-else>{{ item.name }}: 應收 ${{ item.payment }}</span>
              </a-list-item>
            </template>
          </a-list>
        </template>
        <template #expandColumnTitle>
          <span style="color: red">More</span>
        </template>
      </a-table>
    </template>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    height: 100%;
  }
}
</style>
