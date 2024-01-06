<script setup>
import axios from 'axios'
import { reactive, ref, onMounted } from 'vue'
import TravelAddButton from '../components/Travel/AddButton.vue'
const { VITE_API_URL } = import.meta.env

const dataSource = ref([])

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
  //update db
  // Object.assign(dataSource.value.filter(item => id === item.id)[0], editableData[id]);
  const { data } = await axios.put(`${VITE_API_URL}/projects/${id}`, editableData[id])
  console.log('edit', data)
  delete editableData[id]
  await fetchProjects()
}
const cancelEdit = (id) => {
  delete editableData[id]
}

const onDelete = async (id) => {
  // dataSource.value = dataSource.value.filter((item) => item.id !== id)
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
    <TravelAddButton @fetchData="fetchProjects" />
    <a-table bordered :data-source="dataSource" :columns="columns" @change="handleTableChange">
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
            <a-input
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id][column.dataIndex]"
              style="margin: -5px 0"
            />
            <template v-else>
              <router-link :to="'/travel/' + `${record.id}`">
                {{ text }}
              </router-link>
            </template>
          </div>
        </template>
        <template
          v-else-if="['startDate', 'endDate', 'currency', 'location'].includes(column.dataIndex)"
        >
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
    </a-table>
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
