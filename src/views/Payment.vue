<script setup>
import axios from 'axios'
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { VITE_API_URL } = import.meta.env

const route = useRoute()
const router = useRouter()
const projectId = ref(route.params.id)
const dataSource = ref({})

onMounted(async () => {
  console.log(projectId.value)
  await fetchOneProject(projectId.value)
})

const fetchOneProject = async (projectId) => {
  const { data } = await axios.get(`${VITE_API_URL}/projects/${projectId}`)
  console.log(data.data)

  data.data.startDate = data.data.startDate.split('T')[0]
  data.data.endDate = data.data.endDate.split('T')[0]

  dataSource.value = data.data
  console.log(dataSource.value)
}

const routerBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="payment">
    <button @click="routerBack">back to last page</button>
    <div style="background: #ececec; padding: 30px">
      <a-card title="Card title" :bordered="false" style="width: 100%">
        <p>Name: {{ dataSource.name }}</p>
        <p>date range: {{ dataSource.startDate }} - {{ dataSource.endDate }}</p>
        <p>location: {{ dataSource.location }}</p>
        <p>currency: {{ dataSource.currency }}</p>
        <p>users:</p>
        <ul>
          <li v-for="item in dataSource.users" :key="item.id">
            {{ item }}
          </li>
        </ul>
      </a-card>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .payment {
    height: 100%;
  }
}
</style>
