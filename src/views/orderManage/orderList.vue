<template>
  <div>
    <el-card>
      <el-input
        v-model="orderListForm.query"
        placeholder="搜索订单"
        clearable
        @clear="inputClear"
      >
        <el-button
          @click="searchHandle"
          slot="append"
          icon="el-icon-search"
        ></el-button>
      </el-input>

      <el-table border stripe :data="orderListData.goods">
        <el-table-column type="expand"> </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column min-width="200px" prop="order_number" label="订单编号"></el-table-column>
        <el-table-column min-width="120px"  prop="order_price" label="订单价格"></el-table-column>
        <el-table-column min-width="120px" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === 1" type="success"
              >已付款</el-tag
            >
            <el-tag type="warning">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="120px"  label="是否发货">
          <template slot-scope="scope">
            <span v-if="scope.row.is_send === '是'">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200px"  label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column  min-width="130px" label="操作">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              @click="locationClick"
              size="mini"
              type="success"
              icon="el-icon-location"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderListForm.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="orderListForm.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="orderListData.total"
      >
      </el-pagination>
    </el-card>

    <!-- location 对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="locationDialogVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in fakeProgressData"
          :key="index"
          :icon="activity.icon"
          type="primary"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList } from "network/order/orderList";

export default {
  data() {
    return {
      // 请求订单列表的表单
      orderListForm: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      // 保存订单列表的数据
      orderListData: {
        pagenum: 0,
        total: 0,
        goods: [],
      },
      // 控制 location 对话框的显示
      locationDialogVisible: false,
    };
  },
  created() {
    this.getOrderListPut();
  },
  methods: {
    // 数据请求方法
    // 请求订单列表数据
    async getOrderListPut() {
      const { data: res } = await getOrderList(this.orderListForm);
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      // this.$message.success('获取')
      this.orderListData = res.data;
      console.log(this.orderListData);
    },

    // 事件监听
    // 监听分页器的 size 变化
    handleSizeChange(size) {
      this.orderListForm.pagesize = size;
      this.getOrderListPut();
    },
    // 监听分页器的当前页数变化
    handleCurrentChange(num) {
      this.orderListForm.pagenum = num;
      this.getOrderListPut();
    },

    // 监听搜索输入框的清空事件
    inputClear() {
      this.orderListForm.pagenum = 1;
      this.getOrderListPut();
      this.$message.success("清除搜索框，更新视图");
    },
    // 监听搜索框的搜索点击按钮
    searchHandle() {
      console.log(this.orderListForm);
      this.orderListForm.pagenum = 1;
      this.getOrderListPut();
      this.$message.error("查询数据成功，但接口查询功能未实现");
    },
    // 监听location按钮的点击
    locationClick() {
      this.locationDialogVisible = true
      this.$message.success('暂不支持查询物流信息，使用假数据代替')
    },
  },
  computed: {
    fakeProgressData() {
      return [
        {
          time: "2020-09-11 09:39:00",
          context: "已签收，感谢再次使用顺丰，期待再次为您服务",
          icon: 'el-icon-more'
        },
        {
          time: "2020-09-10 14:39:00",
          context: "[湖北省] 武汉江夏 顺丰速递 93358为您派件",
        },
        {
          time: "2020-09-10 09:39:00",
          context: "[湖北省] 湖北市 顺丰速递 93358为您派件",
        },
        {
          time: "2020-09-09 16:39:00",
          context: "[湖南省] 湖北市 顺丰速递 93358为您派件",
        },
        {
          time: "2020-09-09 09:39:00",
          context: "[上海市] 上海 顺丰速递 93358为您派件",
        },
      ];
    },
  },
};
</script>

<style lang='less' scoped>
.el-input {
  width: 400px;
}
</style>