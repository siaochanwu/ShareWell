<script setup>
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { reactive, ref, defineEmits } from 'vue'
const { VITE_API_URL } = import.meta.env
const emit = defineEmits(['fetchData'])

const formRef = ref()
const visible = ref(false)
const formState = reactive({
  name: '',
  nickName: '',
  email: ''
})

const onOk = () => {
  console.log('formState: ', formState)
  handleAdd(formState)
  visible.value = false
  formRef.value.resetFields()
}

const handleAdd = async ({ name, nickName, email }) => {
  const newData = {
    id: uuidv4(),
    name: name,
    nickName: nickName,
    email: email
  }
  if (!name || !nickName || !email) {
    alert('欄位必填')
    return
  }

  try {
    const { data } = await axios.post(`${VITE_API_URL}/users`, newData)
    console.log('post done', data)
    emit('fetchData')
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <div>
    <button class="addBtn" type="primary" @click="visible = true">Add</button>
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
          :rules="[{ type: 'email', required: true, message: 'Please input the email of user!' }]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.addBtn {
  background-color: cadetblue;
  border: none;
  border-radius: 10%;
  padding: 10px 15px;
  color: #fff;
  cursor: pointer;
}
</style>
