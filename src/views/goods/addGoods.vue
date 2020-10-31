<template>
  <div id="addGoods">
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        :closable="false"
        center
      >
      </el-alert>

      <el-steps
        :space="250"
        align-center
        :active="+activeIndex"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-tabs
        :before-leave="tabsChange"
        @tab-click="tabClick"
        v-model="activeIndex"
        tab-position="left"
        style="height: 200px"
      >
        <el-tab-pane name="0" label="基本信息">
          <el-form
            ref="addForm1"
            :rules="addGoodsRules"
            :model="addGoodsForm1"
            label-position="top"
            label-width="80px"
          >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm1.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                type="number"
                v-model="addGoodsForm1.goods_price"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                type="number"
                v-model="addGoodsForm1.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                type="number"
                v-model="addGoodsForm1.goods_weight"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <template>
                <el-cascader
                  v-model="addGoodsForm1.goods_catArr"
                  :options="goodsClassifyData"
                  :props="goodsClassifyOptions"
                  @change="handleChange"
                  placeholder="请选择三级分类"
                ></el-cascader>
              </template>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="1" label="商品参数">
          <div
            class="manyParamsBox"
            v-for="item in manyParams"
            :key="item.attr_id"
          >
            <div class="title">{{ item.attr_name }}</div>
            <el-checkbox-group v-model="manyCheckSlected">
              <el-checkbox
                border
                v-for="(item2, index2) in item.attr_vals"
                :label="item2"
                :key="index2"
                >{{ item2 }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品属性">
          <div
            class="manyParamsBox"
            v-for="item in onylParams"
            :key="item.attr_id"
          >
            <div class="title">{{ item.attr_name }}</div>
            <el-checkbox-group v-model="onlyCheckSlected">
              <el-checkbox
                border
                v-for="(item2, index2) in item.attr_vals"
                :label="item2"
                :key="index2"
                >{{ item2 }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-tab-pane>
        <!-- 备用地址https://www.liulongbin.top:8888/api/private/v1/ -->
        <el-tab-pane name="3" label="商品图片">
          <el-upload
            :headers="uploadHeader"
            class="upload-demo"
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
            :on-success="uploadSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品内容">
          <quill-editor
            ref="myQuillEditor"
            v-model="addGoodsForm1.goods_introduce"
          />

          <el-button @click="addGoodsClick" class="addGoodsBtn" type="primary"
            >添加商品</el-button
          >
        </el-tab-pane>
        <el-tab-pane name="5" label="创建完成">创建完成</el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="imgPreviewVisible" width="30%">
      <!-- <span>这是一段信息</span> -->
      <img class="perViewImg" :src="previewSrc" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsClassify,
  getManyParams,
  getOnlyParams,
  addGoods,
} from "network/goodsManage/addGoods";

export default {
  data() {
    return {
      // 步骤索引
      activeIndex: "0",
      // 添加商品的表单
      addGoodsForm1: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_catArr: "",
        goods_cat: "",
        goods_introduce: "",
      },

      // 图片上传的参数
      imgUploadParams: [],
      // 动态参数表单
      manyParamsForm: [],
      // 添加商品表单的验证规则
      addGoodsRules: {
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
        goods_cat: [
          { required: true, message: "商品分类不能为空", triggle: "blur" },
        ],
      },
      // 保存商品分类列表的数据
      goodsClassifyData: [],
      // 保存商品分类级联选择器的选择规则
      goodsClassifyOptions: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 保存当前选中分类的 id
      currentClassifyId: "",
      // 保存分类的动态参数
      manyParams: [],
      // 保存分类的静态参数
      onylParams: [],
      // 动态参数选中的数组
      manyCheckSlected: [],
      // 静态参数选中的数组
      onlyCheckSlected: [],
      // 保存图片的列表
      fileList: [],
      // 图片上传的请求头部
      uploadHeader: {},
      // 控制图片预览对话框
      imgPreviewVisible: false,
      // 预览图片的路径
      previewSrc: "",
    };
  },
  created() {
    this.getGoodsClassifyPut();
    this.uploadHeader.Authorization = window.sessionStorage.getItem("token");
  },
  methods: {
    // 数据请求方法
    // 请求获取商品分类列表
    async getGoodsClassifyPut() {
      const { data: res } = await getGoodsClassify();
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      this.goodsClassifyData = res.data;
      console.log(this.goodsClassifyData);
    },
    // 根据分类 id 获取动态参数列表
    async getManyParamsPut() {
      const { data: res } = await getManyParams(this.currentClassifyId);
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals.split(",");
        item.attr_vals = item.attr_vals.filter((item2) => {
          if (item2 !== "") {
            return true;
          } else {
            return false;
          }
        });
      });
      this.manyParams = res.data;
      // 将查询到的信息保存到参数表单当中
      this.manyParams.forEach((item) => {
        // 将数组合并成为一个
        item.attr_vals.forEach((item2) => {
          this.manyCheckSlected.push(item2);
        });
        this.manyParamsForm.push({
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(","),
        });
      });
      console.log(this.manyParams);
    },
    // 根据分类 id 获取静态参数列表
    async getOnlyParamsPut() {
      const { data: res } = await getOnlyParams(this.currentClassifyId);
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals.split(",");
        item.attr_vals = item.attr_vals.filter((item2) => {
          if (item2 !== "") {
            return true;
          } else {
            return false;
          }
        });
      });
      this.onylParams = res.data;
      console.log(this.onylParams);
      this.onylParams.forEach((item) => {
        item.attr_vals.forEach((item2) => {
          this.onlyCheckSlected.push(item2);
        });
        this.manyParamsForm.push({
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(","),
        });
      });
    },
    // 请求添加商品
    async addGoodsPut(config) {
      const { data: res } = await addGoods(config);
      console.log(res);
      if (res.meta.status !== 201)
        return this.$message.error("请求数据失败了");
      this.$message.success("添加商品成功");
      this.activeIndex = "5";
    },

    // 事件监听方法
    // 监听 tab 被点击
    tabClick(node) {
      // this.$refs.tabs.before-leave()
    },
    // 监听级联选择器的选中事件
    handleChange(valueArr) {
      // console.log(value)
      if (valueArr.length !== 3) {
        this.$message.error("请选择三级分类");
        this.addGoodsForm1.goods_catArr = [];
        this.addGoodsForm1.goods_cat = "";
        this.currentClassifyId = "";
      } else {
        this.addGoodsForm1.goods_cat = valueArr.join(",");
        this.currentClassifyId = valueArr[valueArr.length - 1];
      }
    },
    // tab切换的钩子
    tabsChange(activeName, oldName) {
      let flag = true;
      // 页面从 0 - 其他
      if (oldName === "0" && activeName !== "0") {
        this.$refs.addForm1.validate((valid) => {
          flag = valid;
          if (!valid) return;
          // 请求数据查询当前分类的信息
          this.getOnlyParamsPut();
          this.getManyParamsPut();
          console.log(this.manyParamsForm);
        });
      } else if (activeName == "4") {
      }
      return flag;
    },
    // 图片上传成功的钩子
    uploadSuccess(response, file, fileList) {
      console.log(response);
      console.log(file);
      this.imgUploadParams.push({ pic: response.data.tmp_path });
      this.previewSrc = file.url;
    },
    // 监听图片的预览
    handlePreview() {
      this.imgPreviewVisible = true;
    },
    // 监听图片的删除
    handleRemove() {},
    // 监听添加商品的按钮点击
    addGoodsClick() {
      const formObj = {};
      Object.assign(
        formObj,
        this.addGoodsForm1,
        { pics: this.imgUploadParams },
        { attrs: this.manyParamsForm }
      );
      this.addGoodsPut(formObj)
    },
  },
};
</script>

<style lang='less' scoped>
.el-steps {
  display: flex;
  margin: 20px 0;
  justify-content: center;
  height: 100%;
}

/deep/ .el-tabs {
  height: 100% !important;
  overflow: visible;
}

.manyParamsBox {
  margin-left: 20px;
}

.el-checkbox {
  margin: 10px 20px 10px 0 !important;
}

.manyParamsBox {
  padding: 0 0 20px 0;
}

.perViewImg {
  width: 100%;
}

/deep/ .ql-container {
  height: 400px;
}

.addGoodsBtn {
  margin-top: 20px;
}
</style>