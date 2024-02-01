<script setup>
import axios from 'axios'
import { reactive, ref, onMounted } from 'vue'
import ProjectAddButton from '../components/Project/AddButton.vue'
const { VITE_API_URL } = import.meta.env

const dataSource = ref([])
const loading = ref(true)

onMounted(async () => {
  await fetchProjects()
})

const fetchProjects = async () => {
  const { data } = await axios.get(`${VITE_API_URL}/projects`)
  data.data.map((item) => {
    item.startDate = item.startDate.split('T')[0]
    item.endDate = item.endDate.split('T')[0]
  })
  dataSource.value = data.data
  console.log(dataSource.value)
  loading.value = false
}

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
  },
  {
    title: 'users',
    dataIndex: 'users'
  },
  {
    title: 'operation',
    dataIndex: 'operation'
  },
  {
    title: 'edit',
    dataIndex: 'edit'
  }
]

const editableData = reactive({})

const edit = (id) => {
  editableData[id] = dataSource.value.filter((item) => id === item.id)[0]
}

const saveEdit = async (id) => {
  const { data } = await axios.put(`${VITE_API_URL}/projects/${id}`, editableData[id])
  console.log('edit', data)
  delete editableData[id]
  await fetchProjects()
}
const cancelEdit = (id) => {
  delete editableData[id]
}

const onDelete = async (id) => {
  try {
    const { data } = await axios.delete(`${VITE_API_URL}/projects/${id}`)
    console.log('delete', data)
    await fetchProjects()
  } catch (err) {
    console.log('err', err)
  }
}

function handleTableChange(pagination, filters, sorter, extra) {
  console.log('params', pagination, filters, sorter, extra)
}
</script>

<template>
  <div class="travel">
    <template v-if="loading">
      <a-skeleton-button />
      <br />
      <br />
      <a-skeleton active />
    </template>
    <template v-else>
      <h2>旅遊清單</h2>
      <ProjectAddButton @fetchData="fetchProjects" />
      <a-table bordered :data-source="dataSource" :columns="columns" @change="handleTableChange">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'edit'">
            <div class="editable-row-operations">
              <button>Edit</button>
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
          <template v-else-if="['users'].includes(column.dataIndex)">
            <span>
              <a-tag
                v-for="(user, index) in record.users"
                :key="user"
                :color="index % 2 == 0 ? 'green' : 'geekblue'"
              >
                {{ user }}
              </a-tag>
            </span>
          </template>
          <template v-else-if="['name'].includes(column.dataIndex)">
            <div>
              <router-link :to="'/project/' + `${record.id}`">
                {{ text }}
              </router-link>
            </div>
          </template>
          <template
            v-else-if="['startDate', 'endDate', 'currency', 'location'].includes(column.dataIndex)"
          >
            <div>
              {{ text }}
            </div>
          </template>
        </template>
      </a-table>
    </template>
  </div>
</template>

<style scoped>
.editable-cell {
  position: relative;
}
.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  margin-top: 4px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
@media (min-width: 1024px) {
  .user {
    height: 100%;
  }
}
</style>
