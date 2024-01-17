<script setup>
import axios from 'axios'
import { reactive, ref, defineEmits, onMounted } from 'vue'
const { VITE_API_URL } = import.meta.env
const emit = defineEmits(['fetchData'])
const dateFormat = 'YYYY/MM/DD'

const formRef = ref()
const visible = ref(false)
const dateRange = ref([])
const showUsers = ref([])


const initialState = {
  name: '',
  startDate: '',
  endDate: '',
  currency: 'TWD',
  location: '',
  users: []
}

const formState = reactive({...initialState})

onMounted(async () => {
  await fetchUsers()
})

const fetchUsers = async () => {
  const { data } = await axios.get(`${VITE_API_URL}/users`)
  data.data.forEach((item, index) => {
    showUsers.value.push({
      label: data.data[index].name,
      value: data.data[index].id
    })
  })
}

const onOk = () => {
  console.log('formState: ', formState)
  handleAdd(formState)
  visible.value = false
  formRef.value.resetFields()
}

const handleAdd = async (formState) => {
  const newData = formState
  console.log(newData)

  if (
    !newData.name ||
    !newData.startDate ||
    !newData.endDate ||
    !newData.currency ||
    !newData.location
  ) {
    alert('欄位必填')
    return
  }

  try {
    const { data } = await axios.post(`${VITE_API_URL}/projects`, newData)
    console.log('post done', data)
    emit('fetchData')
  } catch (err) {
    console.log(err)
  }
}

const focus = () => {
  console.log('focus')
}

const handleCurrenyChange = (currency) => {
  console.log(currency)
}

const handleDateRange = (date, dateString) => {
  formState.startDate = dateString[0]
  formState.endDate = dateString[1]
}

const handleUserChange = (user) => {
  console.log(`users: ${user}`)
  formState.users = user
}
</script>

<template>
  <div>
    <a-button class="addBtn" type="primary" @click="visible = true">Add</a-button>
    <a-modal
      v-model:open="visible"
      title="Add new Project"
      ok-text="Create"
      cancel-text="Cancel"
      @ok="onOk"
    >
      <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal">
        <a-form-item
          name="name"
          label="name"
          :rules="[{ required: true, message: 'Please input the name of Project!' }]"
        >
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item name="date" label="date">
          <a-range-picker v-model:value="dateRange" :format="dateFormat" @change="handleDateRange" />
        </a-form-item>

        <a-form-item name="currency" label="currency" :rules="[{ required: true }]">
          <a-select
            ref="select"
            v-model:value="formState.currency"
            style="width: 120px"
            @focus="focus"
            @change="handleCurrenyChange"
          >
            <a-select-option value="TWD">TWD</a-select-option>
            <a-select-option value="USD">USD</a-select-option>
            <a-select-option value="JPY">JPY</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          name="location"
          label="location"
          :rules="[{ required: true, message: 'Please input the location of Project!' }]"
        >
          <a-input v-model:value="formState.location" />
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
