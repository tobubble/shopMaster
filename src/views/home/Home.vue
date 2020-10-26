<template>
  <div id="home">
    <el-container class="homeContainer">
      <!-- 头部区域 -->
      <el-header style="height: 70px">
        <div class="avatarBox">
          <img src="~assets/img/tokisaki3.png">
        </div>
        <div class="title">
          电商后台管理系统
        </div>
        <el-button class="exist" type="primary">退出</el-button>
      </el-header>
      <el-container>
        <!-- aside 区域 -->
        <el-aside style="width: 250px">
          我是 aside
        </el-aside>
        <!-- main区域 -->
        <el-main>哈哈哈我是 main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang='less' scoped>
  #home,.homeContainer {
    height: 100%;
  }

  .el-header {
    background: #363d40;
    height: 100px;
    display: flex;
    color: #fffffe;
    line-height: 70px;
    align-items: center;
  }

  .el-aside {
    background: deepskyblue;
  }

  .el-main {
    background: darkturquoise;
  }

  .avatarBox {
    height: 65px;
    width: 65px;
    border-radius: 50%;
    overflow: hidden;
    margin-top: 2px;

    img {
      height: 100%;
    }
  }

  .title {
    margin-right: auto;
    margin-left: 20px;
  }

  .exist {
    height: 38px;
    background: #909399;
    border: 1px solid #909399;
  }
</style>