<script setup>
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { computed, reactive, ref, onMounted } from 'vue'
const {VITE_API_URL} = import.meta.env

const formRef = ref();
const visible = ref(false);
const formState = reactive({
  name: '',
  nickName: '',
  email: '',
});
const dataSource = ref([])

onMounted(async () => {
  await fetchUsers()
})

const fetchUsers = async() => {
  const {data} = await axios.get(`${VITE_API_URL}/users`)
  dataSource.value = data.data
  console.log('www', dataSource)
}

const onOk = () => {
    console.log('formState: ', formState);
    handleAdd(formState)
    visible.value = false;
    formRef.value.resetFields();

//   formRef.value
    // .validateFields()
    // .then(values => {
    //   console.log('Received values of form: ', values);
    //   console.log('formState: ', formState);
    //   visible.value = false;
    //   formRef.value.resetFields();
    //   console.log('reset formState: ', formState);
    // })
    // .catch(info => {
    //   console.log('Validate Failed:', info);
    // });
};

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: '30%'
  },
  {
    title: 'nickName',
    dataIndex: 'nickName'
  },
  {
    title: 'email',
    dataIndex: 'email'
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

// const dataSource = ref([
//   {
//     id: 0,
//     name: 'Edward King 0',
//     nickName: 'ed',
//     email: 'London, Park Lane no. 0'
//   },
//   {
//     id: 1,
//     name: 'Edward King 1',
//     nickName: 'ed',
//     email: 'London, Park Lane no. 1'
//   }
// ])

const editableData = reactive({})

const edit = (id) => {
  editableData[id] = dataSource.value.filter((item) => id === item.id)[0]
}

const saveEdit = (id) => {
  //update db
  Object.assign(dataSource.value.filter(item => id === item.id)[0], editableData[id]);
  delete editableData[id];
};
const cancelEdit = (id) => {
  delete editableData[id];
};

const onDelete = (id) => {
  dataSource.value = dataSource.value.filter((item) => item.id !== id)
}
const handleAdd = async ({name, nickName, email}) => {
  const newData = {
    id: uuidv4(),
    name: name,
    nickName: nickName,
    email: email
  }
  //create db and query again
  try {
    console.log(newData)
    await axios.post(`${VITE_API_URL}/users`, newData)
    console.log('post done')
    await fetchUsers()
  } catch(err) {
    console.log(err)
  }
}
</script>

<template>
  <div class="user">
    <!-- <span>This is an User page</span> -->
    <div>
    <a-button type="primary" @click="visible = true">Add</a-button>
    <a-modal
      v-model:open="visible"
      title="Add new User"
      ok-text="Create"
      cancel-text="Cancel"
      @ok="onOk"
    >
      <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal">
        <a-form-item
          name="name"
          label="name"
          :rules="[{ required: true, message: 'Please input the name of user!' }]"
        >
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item
          name="nickName"
          label="nickName"
          :rules="[{ required: true, message: 'Please input the nickName of user!' }]"
        >
          <a-input v-model:value="formState.nickName" />
        </a-form-item>
        <a-form-item
          name="email"
          label="email"
          :rules="[{ type: 'eemail', required: true, message: 'Please input the email of user!' }]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
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
