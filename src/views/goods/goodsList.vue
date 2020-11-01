<template>
  <div>
    <el-card>
      <div class="inputBox">
        <el-input
          class="inputV"
          v-model="getGoodsParams.query"
          clearable
          @clear="searchClear"
        >
          <el-button
            @click="searchGoodsHandle"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-button @click="addGoodsHandle" class="button" type="primary"
          >添加商品</el-button
        >
      </div>
      <el-table :data="goodsListData.goods" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column min-width="200px" label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          align="center"
          width="140px"
          label="商品价格(元)"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          align="center"
          width="140px"
          label="商品重量(kg)"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column align="center" width="200px" label="商品创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="140px" label="操作">
          <template slot-scope="scope">
            <el-button @click="editGoods(scope.row)" size="mini" type="primary">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button
              @click="deleteGoodsHandle(scope.row)"
              size="mini"
              type="danger"
            >
              <i class="el-icon-delete"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="+goodsListData.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsListData.total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加商品对话框 -->
    <el-dialog
      @closed="eidtGoodsClose"
      title="编辑商品"
      :visible.sync="eidtDialogVisible"
      width="50%"
    >
      <el-form
        :rules="editGoodsRules"
        ref="editGoodsForm"
        :model="editGoodsForm"
        label-width="100px"
      >
        <el-form-item prop="goods_name" label="商品名称: ">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item prop="goods_price" label="商品价格: ">
          <el-input
            type="number"
            v-model="editGoodsForm.goods_price"
          ></el-input>
        </el-form-item>
        <el-form-item prop="goods_number" label="商品数量: ">
          <el-input
            type="number"
            v-model="editGoodsForm.goods_number"
          ></el-input>
        </el-form-item>
        <el-form-item prop="goods_weight" label="商品重量: ">
          <el-input
            type="number"
            v-model="editGoodsForm.goods_weight"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsList,
  eidtGoods,
  deleteGoods,
} from "network/goodsManage/goodList";

export default {
  data() {
    return {
      // 获取商品列表数据参数
      getGoodsParams: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      // 保存商品数据
      goodsListData: {
        goods: [],
        pagenum: 0,
        total: 0,
      },
      // 控制添加商品对话框的显示
      eidtDialogVisible: false,
      // 添加商品的表单
      editGoodsForm: {
        id: "",
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
      },
      // 添加商品的表单验证规则
      editGoodsRules: {
        goods_name: [
          { required: true, message: "商品名称不能为空", triggle: "blur" },
        ],
        goods_price: [
          { required: true, message: "商品价格不能为空", triggle: "blur" },
        ],
        goods_number: [
          { required: true, message: "商品数量不能为空", triggle: "blur" },
        ],
        goods_weight: [
          { required: true, message: "商品重量不能为空", triggle: "blur" },
        ],
      },
      // 保存要删除的商品的 id
      deleteGoodsID: "",
    };
  },
  created() {
    this.getGoodsListPut();
  },
  methods: {
    // 数据请求
    // 请求商品列表
    async getGoodsListPut() {
      const { data: res } = await getGoodsList(this.getGoodsParams);
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.goodsListData = res.data;
      console.log(this.goodsListData);
    },
    // 请求编辑商品
    async eidtGoodsPut() {
      this.editGoodsForm.goods_price = +this.editGoodsForm.goods_price;
      this.editGoodsForm.goods_number = +this.editGoodsForm.goods_number;
      this.editGoodsForm.goods_weight = +this.editGoodsForm.goods_weight;
      this.editGoodsForm = this.editGoodsForm;
      const { data: res } = await eidtGoods(this.editGoodsForm);
      const data = await eidtGoods(this.editGoodsForm);
      console.log(res);
      console.log(data);
      if (res.meta.status !== 200) return this.$message.error("接口有误");
      this.$message.success("修改商品数据成功");
      this.getGoodsListPut();
    },
    // 请求删除商品
    async deleteGoodsPut() {
      const { data: res } = await deleteGoods(this.deleteGoodsID);
      if (res.meta.status !== 200)
        return this.$message.error("请求删除商品失败");
      this.$message.success("删除商品成功");
      this.getGoodsListPut();
    },

    // 事件监听
    // 监听分页的 size 变化
    handleSizeChange(size) {
      this.getGoodsParams.pagesize = size;
      this.getGoodsListPut();
    },
    // 监听分页的页数变化
    handleCurrentChange(num) {
      this.getGoodsParams.pagenum = num;
      this.getGoodsListPut();
    },
    // 监听编辑商品按钮点击
    editGoods(node) {
      console.log(node);
      this.editGoodsForm.goods_name = node.goods_name;
      this.editGoodsForm.goods_price = node.goods_price + "";
      this.editGoodsForm.goods_number = node.goods_number + "";
      this.editGoodsForm.goods_weight = node.goods_weight + "";
      this.editGoodsForm.id = node.goods_id;

      this.eidtDialogVisible = true;
    },
    // 监听修改商品对话框关闭
    eidtGoodsClose() {
      this.$refs.editGoodsForm.resetFields();
    },

    // 监听编辑表单的确定
    editConfirm() {
      this.$refs.editGoodsForm.validate((valid) => {
        if (!valid) return;
        this.eidtGoodsPut();
        this.eidtDialogVisible = false;
      });
    },
    // 监听删除按钮的点击
    deleteGoodsHandle(node) {
      console.log(node);
      this.deleteGoodsID = node.goods_id;
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteGoodsPut();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 监听查询按钮的点击
    searchGoodsHandle() {
      this.getGoodsParams.pagenum = 1;
      this.getGoodsListPut();
    },
    //监听清除查询按钮的点击
    searchClear() {
      this.getGoodsParams.pagenum = 1;
      this.getGoodsListPut();
    },

    // 监听天机商品按钮的点击
    addGoodsHandle() {
      this.$router.push("/addGoods");
    },
  },
};
</script>

<style lang='less' scoped>
.el-col {
  display: flex;
}

.button {
  margin-left: 10px;
}

.el-table {
  margin-top: 20px;
}

.inputV {
  width: 400px;
}

.inputBox {
  width: 600px;
}
</style>