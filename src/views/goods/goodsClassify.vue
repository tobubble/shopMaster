<template>
  <div>
    <el-card>
      <el-button type="primary" @click="addClassifyHandle">添加分类</el-button>

      <el-table :data="goodsClassifyData.result" border stripe row-key="cat_id">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="分类名称" prop="cat_name"> </el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <i
              v-if="scope.row.cat_deleted === false"
              class="el-icon-circle-check icon"
            ></i>
            <i v-else class="el-icon-circle-check iconfalse"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-tag size="medium" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag
              size="medium"
              v-else-if="scope.row.cat_level === 1"
              type="success"
              >二级</el-tag
            >
            <el-tag size="medium" v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="editGoodsClassify(scope.row)"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              @click="deleteClassify(scope.row)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="GoodsClassifyForm.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsClassifyData.total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      @closed="addClassifyClosed"
      title="添加分类"
      :visible.sync="addClassifydialog"
      width="50%"
    >
      <el-form
        ref="addClassify"
        :rules="addClassifyRules"
        :model="addClassifyForm"
        label-width="100px"
      >
        <el-form-item label="分类名称 : " prop="cat_name">
          <el-input v-model="addClassifyForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称 : ">
          <el-cascader
            v-model="selectedArr"
            :options="goodsSecondClassify"
            :props="addClassifyProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addClassifydialog = false">取 消</el-button>
        <el-button type="primary" @click="addClassifyConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑份额里名称点击 -->
    <el-dialog
      title="编辑商品分类名称"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        ref="editForm"
        label-width="100px"
        :rules="editClassifyFormRules"
        :model="editClassifyForm"
      >
        <el-form-item label="分类名称 : " prop="cat_name">
          <el-input v-model="editClassifyForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
console.time("aaa");
import {
  getGoodsClassify,
  addGoodsClassify,
  editGoodsClassify,
  deleteGoodsClassify,
} from "network/goodsManage/goodsClassify";

export default {
  data() {
    return {
      // 保存商品分类的数据
      goodsClassifyData: {
        pagenum: 1,
        pagesize: 5,
        total: 0,
        result: [],
      },
      // 保存商品分类数据的请求参数
      GoodsClassifyForm: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 保存商品分类数据的请求参数
      GoodsClassifyForm2: {
        type: 2,
        pagenum: "",
        pagesize: "",
      },
      // 保存商品分类2级数据
      goodsSecondClassify: [],
      // 控制添加分类对话框的显示
      addClassifydialog: false,
      // 保存添加商品分类参数
      addClassifyForm: {
        cat_name: "",
        cat_level: 0,
        cat_pid: 0,
      },
      // 添加参数的级联选择器展示规则
      addClassifyProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
        checkStrictly: true,
      },
      // 添加参数级联选择器的 value 数组
      selectedArr: [],
      // 添加参数验证表单
      addClassifyRules: {
        cat_name: [
          { required: true, message: "商品分类名称不能为空", triggle: "blur" },
        ],
      },
      // 控制编辑分类表单的显示
      editDialogVisible: false,
      // 编辑分类表单
      editClassifyForm: {
        id: "",
        cat_name: "",
      },
      // 编辑分类表单的验证规则
      editClassifyFormRules: {
        cat_name: [
          { required: true, message: "商品分类名称不能为空", triggle: "blur" },
        ],
      },
      // 删除分类的表单
      deleteId: "",
    };
  },
  created() {
    this.getGoodsClassifyPut();
  },
  methods: {
    // 数据请求
    // 请求获取所有商品分类数据
    async getGoodsClassifyPut() {
      const { data: res } = await getGoodsClassify(this.GoodsClassifyForm);
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      this.goodsClassifyData = res.data;
      console.log(this.goodsClassifyData);
    },
    // 请求获取二级商品分类数据
    async getGoodsClassifyPut2() {
      const { data: res } = await getGoodsClassify(this.GoodsClassifyForm2);
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      this.goodsSecondClassify = res.data;
      console.log(this.goodsSecondClassify);
    },
    // 请求添加商品分类
    async addGoodsClassifyPut() {
      const { data: res } = await addGoodsClassify(this.addClassifyForm);
      if (res.meta.status !== 201)
        return this.$message.error("添加商品分类失败");
      this.$message.success("添加商品分类成功");
      this.getGoodsClassifyPut();
      this.addClassifydialog = false;
    },
    // 请求编辑商品分类参数名称
    async editGoodsClassifyPut() {
      const { data: res } = await editGoodsClassify(this.editClassifyForm);
      if (res.meta.status !== 200) return this.$message.error("编辑失败");
      this.$message.success("修改参数名称成功");
      this.getGoodsClassifyPut();
    },
    // 请求删除分类
    async deleteGoodsClassifyPut() {
      const { data: res } = await deleteGoodsClassify(this.deleteId);
      if (res.meta.status !== 200) return this.$message.error("删除");
      this.$message.success("删除商品分类成功");
      this.getGoodsClassifyPut();
    },

    // 事件监听
    // 监听分页器的 size 变化
    handleSizeChange(size) {
      this.GoodsClassifyForm.pagesize = size;
      this.getGoodsClassifyPut();
    },
    // 监听分页器的 页数发生变化
    handleCurrentChange(num) {
      this.GoodsClassifyForm.pagenum = num;
      this.getGoodsClassifyPut();
    },
    // 添加分类按钮的点击
    addClassifyHandle() {
      this.addClassifydialog = true;
      // 请求获取二级分类
      this.getGoodsClassifyPut2();
    },
    // 监听级联选择器的选中事件
    handleChange(valueArr) {
      if (valueArr.length === 0) {
        this.addClassifyForm.cat_pid = 0;
      } else {
        this.addClassifyForm.cat_pid = valueArr[valueArr.length - 1];
      }
      this.addClassifyForm.cat_level = valueArr.length;
      console.log(this.addClassifyForm);
    },
    // 监听添加分类对话框的关闭事件
    addClassifyClosed() {
      this.$refs.addClassify.resetFields();
      this.selectedArr = [];
      this.addClassifyForm.cat_level = 0;
      this.addClassifyForm.cat_pid = 0;
    },
    // 监听添加参数的确定提交点击
    addClassifyConfirm() {
      console.log(this.addClassifyForm);
      this.$refs.addClassify.validate((valid) => {
        if (!valid) return;
        this.addGoodsClassifyPut();
      });
    },
    // 监听编辑商品分类名称点击
    editGoodsClassify(node) {
      this.editClassifyForm.cat_name = node.cat_name;
      this.editClassifyForm.id = node.cat_id;
      this.editDialogVisible = true;
    },
    // 监听编辑表单的确认提交
    editDialogConfirm() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) return;
        this.editGoodsClassifyPut();
        this.editDialogVisible = false;
      });
    },

    // 监听分类的删除点击
    deleteClassify(node) {
      this.deleteId = node.cat_id;
      this.$confirm("此操作将永久删除该商品分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteGoodsClassifyPut()
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};

console.timeEnd("aaa");
</script>

<style lang='less' scoped>
.el-table {
  margin: 20px 0;
}

.icon {
  color: #67c23a;
  font-size: 18px;
}

.iconfalse {
  font-size: 18px;
  color: #e6a23c;
}

.el-cascader {
  width: 100%;
}
</style>