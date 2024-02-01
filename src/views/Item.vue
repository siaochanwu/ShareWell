<script setup>
import axios from 'axios'
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PaymentAddButton from '../components/Item/Addbutton.vue'
const { VITE_API_URL } = import.meta.env

const route = useRoute()
const router = useRouter()
const projectId = ref(route.params.id)
const projectDetail = ref({})
const dataSource = ref([])
const editableData = reactive({})
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
    title: 'price',
    dataIndex: 'price',
    sorter: {
      compare: (a, b) => a.price - b.price
    }
  },
  {
    title: 'date',
    dataIndex: 'date',
    sorter: {
      compare: (a, b) => new Date(a.date) - new Date(b.date)
    }
  },
  {
    title: 'payer',
    dataIndex: 'payer',
    sorter: {
      compare: (a, b) => a.payer.localeCompare(b.payer)
    }
  },
  // {
  //   title: 'users',
  //   dataIndex: 'users'
  // },
  {
    title: 'operation',
    dataIndex: 'operation'
  },
  {
    title: 'edit',
    dataIndex: 'edit'
  }
]

onMounted(async () => {
  console.log(projectId.value)
  await fetchOneProject(projectId.value)
  await fetchItems(projectId.value)
})

const fetchOneProject = async (projectId) => {
  const { data } = await axios.get(`${VITE_API_URL}/projects/${projectId}`)
  console.log(data.data)

  projectDetail.value = data.data
  projectDetail.value.startDate = projectDetail.value.startDate.split('T')[0]
  projectDetail.value.endDate = projectDetail.value.endDate.split('T')[0]
}

const fetchItems = async (projectId) => {
  const { data } = await axios.get(`${VITE_API_URL}/items/${projectId}`)
  dataSource.value = data.data
  dataSource.value.map((item) => {
    item.date = item.date.split('T')[0]
  })
  console.log(data.data)
}

const routerBack = () => {
  router.go(-1)
}

const edit = (id) => {
  editableData[id] = dataSource.value.filter((item) => id === item.id)[0]
}

const saveEdit = async (id) => {}
const cancelEdit = (id) => {
  delete editableData[id]
}

const onDelete = async (id) => {
  try {
    const { data } = await axios.delete(`${VITE_API_URL}/items/${id}`)
    console.log('delete', data)
    await fetchItems(projectId.value)
  } catch (err) {
    console.log('err', err)
  }
}

const fetchItemRelation = async (itemId, payer) => {
  const { data } = await axios.post(`${VITE_API_URL}/itemRelations`, {
    itemId,
    payer
  })
  console.log('fetchItemRelation', data.data)
  innerData.value = data.data
}

const expand = async (expanded, record) => {
  if (expanded) {
    await fetchItemRelation(record.id, record.payer)
  }
}

function handleTableChange(pagination, filters, sorter, extra) {
  console.log('params', pagination, filters, sorter, extra)
}
</script>

<template>
  <div class="payment">
    <button @click="routerBack">back to last page</button>
    <a-flex style="background: #ececec; padding: 30px" options="'space-between'">
      <a-card :title="projectDetail.name" :bordered="false" style="width: 30%; margin-right: 10px">
        <a-flex vertical="vertical" justify="space-between" align="alignItems">
          <p>date range: {{ projectDetail.startDate }} - {{ projectDetail.endDate }}</p>
          <p>location: {{ projectDetail.location }}</p>
          <p>currency: {{ projectDetail.currency }}</p>
        </a-flex>
        <p>users:</p>
        <ul>
          <li v-for="item in projectDetail.users" :key="item.id">
            {{ item }}
          </li>
        </ul>
      </a-card>

      <div style="width: 70%">
        <PaymentAddButton
          :projectId="projectId"
          :startDate="projectDetail.startDate"
          :endDate="projectDetail.endDate"
          @fetchData="fetchItems"
        />
        <a-table
          bordered
          :data-source="dataSource"
          :columns="columns"
          @change="handleTableChange"
          :expand-column-width="100"
          style="margin-top: 5px"
          :rowKey="(record) => record.id"
          @expand="expand"
        >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'edit'">
              <div class="editable-row-operations">
                <span v-if="editableData[record.id]">
                  <a-typography-link @click="saveEdit(record.id)">Save</a-typography-link>
                  <a-popconfirm title="Sure to cancel?" @confirm="cancelEdit(record.id)">
                    <a>Cancel</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a @click="edit(record.id)">Edit</a>
                </span>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <a-popconfirm
                v-if="dataSource.length"
                title="Sure to delete?"
                @confirm="onDelete(record.id)"
              >
                <a>Delete</a>
              </a-popconfirm>
            </template>
            <template v-else-if="['name', 'date', 'price', 'payer'].includes(column.dataIndex)">
              <div>
                <a-input
                  v-if="editableData[record.id]"
                  v-model:value="editableData[record.id][column.dataIndex]"
                  style="margin: -5px 0"
                />
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>
          </template>
          <template #expandedRowRender>
            <a-list bordered :data-source="innerData">
              <template #renderItem="{ item }">
                <a-list-item>
                  <span style="color: red" v-if="item.payment > 0"
                    >{{ item.name }} 應收total ${{ item.payment }}</span
                  >
                  <span style="color: green" v-else
                    >{{ item.name }} 需付 {{ item.payer }} ${{ -item.payment }}</span
                  >
                </a-list-item>
              </template>
            </a-list>
          </template>
          <template #expandColumnTitle>
            <span style="color: red">查看支付</span>
          </template>
        </a-table>
      </div>
    </a-flex>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .payment {
    height: 100%;
  }
}
</style>
