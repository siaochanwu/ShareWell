<script setup>
import axios from 'axios'
import { reactive, ref, defineEmits, defineProps, onMounted } from 'vue'
import * as dayjs from 'dayjs'
const { VITE_API_URL } = import.meta.env
const emit = defineEmits(['fetchData'])
const dateFormat = 'YYYY/MM/DD'

const formRef = ref()
const visible = ref(false)
const showUsers = ref([])
const date = ref('')
const project_id = ref('')

const initialState = {
  projectId: project_id,
  name: '',
  price: 0,
  itemDate: '',
  payerId: 'TWD',
  payment: 0,
  users: [] //share people
}

const formState = reactive({ ...initialState })

const props = defineProps(['projectId', 'startDate', 'endDate'])

onMounted(async () => {
  project_id.value = props.projectId
  await fetchUsers()
})

const disabledDate = (current) => {
  return (
    (current && current < dayjs(props.startDate)) || current > dayjs(props.endDate).add(1, 'day')
  )
}

const fetchUsers = async () => {
  const { data } = await axios.get(`${VITE_API_URL}/projectUser/${props.projectId}`)
  data.data.forEach((item, index) => {
    showUsers.value.push({
      label: data.data[index].name,
      value: data.data[index].id
    })
  })
}

const onOk = () => {
  handleAdd(formState)
  visible.value = false
  formRef.value.resetFields()
}

const handleAdd = async (formState) => {
  const newData = formState
  console.log('wwwwwwww', newData)

  if (
    !newData.name ||
    !newData.price ||
    !newData.itemDate ||
    !newData.payerId ||
    !newData.payment
  ) {
    alert('欄位必填')
    return
  }

  //新增Item
  //顯示table
  //計算收.付

  try {
    const { data } = await axios.post(`${VITE_API_URL}/items`, newData)
    console.log('post done', data)
    emit('fetchData', project_id.value)
  } catch (err) {
    console.log(err)
  }
}

const handleDate = (value, date) => {
  formState.itemDate = date
}

const handlePayerChange = (user) => {
  formState.payerId = user
}

const handleUserChange = (user) => {
  console.log('user', user)
  formState.users = user
}
</script>

<template>
  <div>
    <a-button class="addBtn" type="primary" @click="visible = true">Add</a-button>
    <a-modal
      v-model:open="visible"
      title="Add new Item"
      ok-text="Create"
      cancel-text="Cancel"
      @ok="onOk"
    >
      <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal">
        <a-form-item
          name="name"
          label="name"
          :rules="[{ required: true, message: 'Please input the name of Item!' }]"
        >
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item
          name="price"
          label="price"
          :rules="[{ required: true, message: 'Please input the price of Item!' }]"
        >
          <a-input-number v-model:value="formState.price" />
        </a-form-item>
        <a-form-item name="date" label="date">
          <a-date-picker
            v-model:value="date"
            :format="dateFormat"
            :disabledDate="disabledDate"
            @change="handleDate"
          />
        </a-form-item>
        <a-form-item name="payer" label="payer">
          <a-select
            style="width: 100%"
            placeholder="Please select"
            :options="showUsers"
            @change="handlePayerChange"
          ></a-select>
        </a-form-item>

        <a-form-item
          name="payment"
          label="payment"
          :rules="[{ required: true, message: 'Please input the payment of Item!' }]"
        >
          <a-input-number v-model:value="formState.payment" />
        </a-form-item>
        <a-form-item name="users" label="users" :rules="[{ required: true }]">
          <a-select
            mode="multiple"
            style="width: 100%"
            placeholder="Please select"
            :options="showUsers"
            @change="handleUserChange"
          ></a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
</style>
