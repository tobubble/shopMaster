<template>
  <div>
    <el-card>
      <el-table :data="authorityData" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'" >一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {getAuthorityList} from 'network/authorityManage/authorityList'

  export default {
    data() {
      return {
        // 保存权限列表数据
        authorityData: [],
      }
    },
    created() {
      this.getAuthorityListPut()
    },
    methods: {
      async getAuthorityListPut() {
        const {data: res} = await getAuthorityList()
        if(res.meta.status !== 200) return this.$message.error('获取数据失败')
        this.authorityData = res.data
        console.log(this.authorityData)
      }
    }
  }
</script>

<style lang='less' scoped>

</style>