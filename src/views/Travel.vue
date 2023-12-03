<script setup>
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';

</script>



<template>
  <div class="travel">
    <div style="background-color: #ececec; padding: 20px">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-card hoverable style="width: 300px">
    <template #cover>
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    </template>
    <template #actions>
      <setting-outlined key="setting" />
      <edit-outlined key="edit" />
      <ellipsis-outlined key="ellipsis" />
    </template>
    <a-card-meta title="清邁" description="2023/12/12-2023/12/20">
      <template #avatar>
        <a-avatar src="https://joeschmoe.io/api/v1/random" />
      </template>
    </a-card-meta>
  </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="Card title" :bordered="false">
            <p>card content</p>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="Card title" :bordered="false">
            <p>card content</p>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .travel {
    height: 100%;
    
  }
}
</style>
