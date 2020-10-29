<template>
  <div>
    <el-card>
      <el-button type="primary" @click="aaa">点我试试</el-button>
    </el-card>
  </div>
</template>

<script>
  export default {
    methods: {
      aaa() {
        console.log(this.$route)
      }
    }
  }
</script>

<style lang='less' scoped>

</style>