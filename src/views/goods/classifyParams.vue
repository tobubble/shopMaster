<template>
  <div>
    <el-card>
      <el-alert
        :closable="false"
        type="warning"
        show-icon
        title="注意: 只允许为第三级分类设置相关参数!"
      ></el-alert>

      <!-- 级联选择器 -->
      <div class="selectBox">
        <span class="info"
          >选择商品分类:
          <el-cascader
            v-model="selectedArr"
            :options="goodsClassifyData"
            :props="goodsClassifyProps"
            @change="handleChange"
          ></el-cascader>
        </span>
      </div>

      <!-- tabs -->
      <el-tabs v-model="activeIndex" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="1">
          <el-button
            @click="addManyHandle"
            class="addParams"
            type="primary"
            size="small"
            >添加参数</el-button
          >
          <el-table border stripe :data="paramsData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="tag in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm($event, scope.row)"
                  @blur="handleInputConfirm($event, scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput($event, scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="editParamsHandle(scope.row)"
                  size="mini"
                  type="primary"
                  >编辑</el-button
                >
                <el-button
                  @click="deleteParamsHandle(scope.row)"
                  size="mini"
                  type="danger"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="2">
          <el-button
            @click="addManyHandle"
            class="addParams"
            type="primary"
            size="small"
            >添加属性</el-button
          >
          <el-table border stripe :data="paramsData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="tag in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm($event, scope.row)"
                  @blur="handleInputConfirm($event, scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click.native="showInput($event, scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="editParamsHandle(scope.row)"
                  size="mini"
                  type="primary"
                  >编辑</el-button
                >
                <el-button
                  @click="deleteParamsHandle(scope.row)"
                  size="mini"
                  type="danger"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 动态参数表单项目 -->
    <el-dialog
      @closed="addParamsDialogClosed"
      title="添加参数"
      :visible.sync="addParamsDialogVisible"
      width="50%"
    >
      <el-form
        v-if="isAddForm"
        :rules="addParamsRules"
        :model="addManyForm"
        ref="addParams"
        label-width="100px"
      >
        <el-form-item prop="attr_name" label="参数名称: ">
          <el-input v-model="addManyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <el-form
        v-else
        :rules="addParamsRules"
        :model="addManyForm"
        ref="addParams"
        label-width="100px"
      >
        <el-form-item prop="attr_name" label="参数名称: ">
          <el-input v-model="addManyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button v-if="isAddForm" type="primary" @click="addParamsConfirm">确 定</el-button>
        <el-button v-else type="primary" @click="editParamsConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsClassify,
  getParamsById,
  editParams,
  addParams,
  deleteParams,
  editParamsName
} from "network/goodsManage/classifyParams";

export default {
  data() {
    return {
      // 级联选择器的展示规则
      goodsClassifyProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 商品分类数据列表
      goodsClassifyData: [],
      // 级联选择器的绑定的数组
      selectedArr: [],
      // 保存 tab 导航的选择 index
      activeIndex: "1",
      // 根据 分类id查询的参数信息
      paramsData: [],
      // 保存请求获取参数列表数据的表单（添加参数表单）
      getParamsByIdForm: {
        id: "",
        sel: "many",
      },
      // 保存新增标签的输入内容
      inputValue: "",
      // 编辑参数的表单
      eidtParamsForm: {
        id: "",
        attrId: "",
        attr_name: "",
        attr_sel: "",
        attr_vals: "",
      },
      // 动态和静态参数的表单
      addManyForm: {
        id: "",
        attr_name: "",
        attr_sel: "",
        attrId: '',
      },
      // 添加表单的验证规则
      addParamsRules: {
        attr_name: [
          { required: true, message: "参数名称不能为空", triggle: "blur" },
        ],
      },
      // 删除参数的表单
      deleteForm: {
        id: "",
        attrId: "",
      },
      // 控制添加参数表单的出现
      addParamsDialogVisible: false,
      // 控制对话框的是编辑表单还是添加表单的内容
      isAddForm: true,
    };
  },
  created() {
    this.getGoodsClassifyPut();
  },
  methods: {
    // 请求数据方法
    // 请求获取商品分类信息
    async getGoodsClassifyPut() {
      const { data: res } = await getGoodsClassify();
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      this.goodsClassifyData = res.data;
      console.log(this.goodsClassifyData);
    },
    // 根据分类 id 获取参数列表数据
    async getParamsByIdPut() {
      const { data: res } = await getParamsById(this.getParamsByIdForm);
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      res.data.forEach((item) => {
        item.inputVisible = false;
        item.attr_vals = item.attr_vals.split(",");
        item.attr_vals = item.attr_vals.filter((item2) => {
          return item2 ? true : false;
        });
      });
      this.paramsData = res.data;
      console.log(this.paramsData);
    },
    // 请求编辑属性
    async editParamsPut(node) {
      this.eidtParamsForm.id = node.cat_id;
      this.eidtParamsForm.attrId = node.attr_id;
      this.eidtParamsForm.attr_name = node.attr_name;
      this.eidtParamsForm.attr_sel = node.attr_sel;
      this.eidtParamsForm.attr_vals = node.attr_vals.join(",");
      const { data: res } = await editParams(this.eidtParamsForm);
      if (res.meta.status !== 200)
        return this.$message.error("请求编辑参数失败");
      console.log(res.data);
      res.data.attr_vals = res.data.attr_vals.split(",");
      res.data.attr_vals = res.data.attr_vals.filter((item2) => {
        return item2 ? true : false;
      });
      node = res.data;
      this.$message.success("编辑参数信息成功");
    },
    // 请求添加参数
    async addParamsPut() {
      const { data: res } = await addParams(this.addManyForm);
      console.log(res);
      if (res.meta.status !== 201) return this.$message.error("添加参数失败");
      this.$message.success("添加参数成功");
      this.getParamsByIdPut();
    },
    // 请求删除参数
    async deleteParamsPut() {
      const { data: res } = await deleteParams(this.deleteForm);
      if (res.meta.status !== 200) return this.$message.error("删除参数失败");
      this.$message.success("删除参数成功");
      this.getParamsByIdPut();
    },
    // 请求修改参数名
    async editParamsNamePut() {
      const {data: res} = await editParamsName(this.addManyForm)
      if(res.meta.status !== 200) return this.$message.error('修改名称失败')
      this.getParamsByIdPut()
      this.$message.success("修改成功")
    },

    // 事件监听方法
    // 监听选择器的选择事件
    handleChange(valueArr) {
      if (valueArr.length !== 3) {
        this.$message.error("请选择三级分类");
        // 清空选择器
        this.selectedArr = [];
        // 清空 表单中的 id
        this.getParamsByIdForm.id = "";
        // 清空 表格的数据
        this.paramsData = [];
      } else {
        this.getParamsByIdForm.id = valueArr[2];
        this.getParamsByIdPut();
      }
    },
    // 监听 tabs 的点击事件
    handleClick(name) {
      if (name.name === "1") {
        this.getParamsByIdForm.sel = "many";
        if (this.selectedArr.length !== 3) {
          return;
        } else {
          this.getParamsByIdPut();
        }
      } else {
        this.getParamsByIdForm.sel = "only";
        if (this.selectedArr.length !== 3) {
          return;
        } else {
          this.getParamsByIdPut();
        }
      }
    },
    // 监听 tag 参数的删除事件
    handleClose(tag, node) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          node.attr_vals.splice(node.attr_vals.indexOf(tag), 1);
          this.editParamsPut(node);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 监听新增标签的时候 enter 键的点击
    handleInputConfirm(event, node) {
      console.log(node);
      let inputValue = this.inputValue;
      node.inputVisible = false;
      if (!inputValue) {
        return;
      }
      node.attr_vals.push(inputValue);
      this.editParamsPut(node);
      this.inputValue = "";
    },
    // 监听新增标签的点击
    showInput(event, node) {
      console.log(node);
      node.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 监听添加动态参数的按钮的点击
    addManyHandle() {
      if (this.selectedArr.length === 3) {
        this.isAddForm = true
        this.addParamsDialogVisible = true;
        this.addManyForm.id = this.getParamsByIdForm.id;
        this.addManyForm.attr_sel = this.getParamsByIdForm.sel;
      } else {
        this.$message.error("请先选择商品分类");
      }
    },
    // 监听添加表单的确定点击
    addParamsConfirm() {
      this.$refs.addParams.validate((valid) => {
        if (!valid) return;
        this.addParamsPut();
        this.addParamsDialogVisible = false;
      });
    },
    // 监听添加参数表单的关闭
    addParamsDialogClosed() {
      this.$refs.addParams.resetFields();
    },
    // 监听删除参数按钮的点击
    deleteParamsHandle(node) {
      this.deleteForm.id = node.cat_id;
      this.deleteForm.attrId = node.attr_id;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteParamsPut();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 监听编辑表单的点击
    editParamsHandle(node) {
      console.log(node)
      this.addParamsDialogVisible = true
      this.isAddForm = false
      this.addManyForm.attr_name = node.attr_name
      this.addManyForm.id = node.cat_id
      this.addManyForm.attr_sel = node.attr_sel
      this.addManyForm.attrId = node.attr_id

    },
    // 监听修改名称表单确认的点击
    editParamsConfirm() {
            this.$refs.addParams.validate((valid) => {
        if (!valid) return;
        this.editParamsNamePut();
        this.addParamsDialogVisible = false;
      });
    }
  },
};
</script>

<style lang='less' scoped>
.selectBox {
  margin: 20px 0;
}

.el-cascader {
  width: 300px;
  margin-left: 10px;
}

.el-button {
  margin-bottom: 10px;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 180px;
  margin: 10px;
}

.button-new-tag {
  margin: 10px;
}
</style>