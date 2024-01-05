<script setup>
import axios from 'axios'
import { reactive, ref, onMounted } from 'vue'
import UserAddButton from '../components/User/AddButton.vue'
const { VITE_API_URL } = import.meta.env

const dataSource = ref([])

onMounted(async () => {
  await fetchUsers()
})

const fetchUsers = async () => {
  const { data } = await axios.get(`${VITE_API_URL}/users`)
  dataSource.value = data.data
}

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: '30%',
    sorter: {
      compare: (a, b) => a.name.localeCompare(b.name),
    },
  },
  {
    title: 'nickName',
    dataIndex: 'nickName',
    sorter: {
      compare: (a, b) => a.nickName.localeCompare(b.nickName),
    },
  },
  {
    title: 'email',
    dataIndex: 'email',
    sorter: {
      compare: (a, b) => a.email.localeCompare(b.email),
    },
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
  const { data } = await axios.put(`${VITE_API_URL}/users/${id}`, editableData[id])
  console.log('edit', data)
  delete editableData[id]
  await fetchUsers()
}
const cancelEdit = (id) => {
  delete editableData[id]
}

const onDelete = async (id) => {
  // dataSource.value = dataSource.value.filter((item) => item.id !== id)
  try {
    const { data } = await axios.delete(`${VITE_API_URL}/users/${id}`)
    console.log('delete', data)
    await fetchUsers()
  } catch (err) {
    console.log('err', err)
  }
}
</script>

<template>
  <div class="user">
    <UserAddButton @fetchData="fetchUsers" />
    <a-table bordered :data-source="dataSource" :columns="columns">
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
        <template v-else-if="['name', 'nickName', 'email'].includes(column.dataIndex)">
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
