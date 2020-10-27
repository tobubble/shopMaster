<template>
  <div id="home">
    <el-container class="homeContainer">
      <!-- 头部区域 -->
      <el-header style="height: 70px">
        <div class="avatarBox">
          <img src="~assets/img/tokisaki3.png" />
        </div>
        <div class="title">电商后台管理系统</div>
        <el-button @click="logout" class="exist" type="primary">退出</el-button>
      </el-header>
      <el-container>
        <!-- aside 区域 -->
        <el-aside :style="{ width: isColloapse ? '64px' : '250px' }">
          <!-- 左侧的菜单栏 -->
          <el-menu
            :collapse-transition="false"
            :collapse="isColloapse"
            unique-opened
            :default-active="activeIndex"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409EFF"
            @select="menuSelected"
          >
            <!-- 菜单栏上面的收缩按钮 -->
            <div class="collopse" @click="collopseClick">| | |</div>
            <el-submenu
              :index="item1.id + ''"
              v-for="item1 in menuListData"
              :key="item1.id"
            >
              <template slot="title">
                <i :class="item1.icon"></i>
                <span>{{ item1.authName }}</span>
              </template>
              <el-menu-item-group
                v-for="item2 in item1.children"
                :key="item2.id"
              >
                <el-menu-item :index="item2.id + ''">
                  <template>
                    <i class="el-icon-menu"></i>
                    <span>{{ item2.authName }}</span>
                  </template></el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- main区域 -->
        <el-main>
          <router-view></router-view>
          <router-view name="breadcrumb"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { menuList } from "network/home/menuList";

export default {
  data() {
    return {
      // 保存菜单数组
      menuListData: [],
      // 保存 菜单活跃的 索引 默认第一个为 110
      activeIndex: "110",
      // 用对象来保存路由的路径
      routerObj: {
        110: "/userList",
        111: "/characterList",
        112: "/authorityList",
        104: "/goodsList",
        115: "/classifyParams",
        121: "/goodsClassify",
        107: "/orderList",
        146: "/dataSta",
      },
      // 控制菜单栏是否收缩
      isColloapse: false,
    };
  },
  created() {
    this.getMenuListData();
    this.setIndex();
    window.sessionStorage.setItem("activeIndex", 110);
  },
  methods: {
    // 网络请求
    // 获取menu菜单的列表
    async getMenuListData() {
      const { data: res } = await menuList();
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      console.log(res.data);
      res.data.forEach((item) => {
        switch (item.id) {
          case 125:
            item.icon = "el-icon-s-custom";
            break;
          case 103:
            item.icon = "el-icon-s-cooperation";
            break;
          case 101:
            item.icon = "el-icon-s-goods";
            break;
          case 102:
            item.icon = "el-icon-s-order";
            break;
          case 145:
            item.icon = "el-icon-s-marketing";
            break;
        }
        item.children.forEach((item2) => {
          console.log(item2.id);
        });
      });
      this.menuListData = res.data;
    },
    // 事件监听方法
    // 监听右侧列表点击
    menuSelected(index) {
      const currentIndex = window.sessionStorage.getItem("activeIndex");
      // console.log()
      // debugger;
      if (index !== window.sessionStorage.getItem("activeIndex")) {
        // debugger;
        window.sessionStorage.setItem("activeIndex", index);
        this.$router.push(this.routerObj[+index]);
      } else {
        return;
      }
    },
    // 监听菜单栏收缩按钮
    collopseClick() {
      this.isColloapse = !this.isColloapse;
    },
    // 监听退出登录按钮点击
    logout() {
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("activeIndex");
      this.$router.push("/login");
      this.$message.info("退出登录成功");
    },
    // 自定义事件
    setIndex() {
      const index = window.sessionStorage.getItem("activeIndex");
      if (!index) return;
      this.activeIndex = index;
    },
  },
};
</script>

<style lang='less' scoped>
#home,
.homeContainer {
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

.el-menu {
  height: 100%;
  border-right: none;
}

/deep/ .el-menu-item-group__title {
  // margin-left: 0;
  padding: 0;
}

.collopse {
  text-align: center;
  line-height: 25px;
  font-size: 14px;
  color: #fff;
  background: #4a5064;
  user-select: none;
  pointer-events: painted;
  cursor: pointer;
}
</style>