<template>
  <div>
    <el-card>
      <!-- 用户查询功能 -->
      <div class="inputBox">
        <el-input
          class="input"
          v-model="getUserListParams.query"
          clearable
          @clear="searchClear"
        >
          <el-button
            @click="searchClickHandle"
            slot="append"
            class="el-icon-search"
          ></el-button>
        </el-input>
        <el-button @click="addUserHandle" class="searchUser" type="primary"
          >添加用户</el-button
        >
      </div>
      <!-- 表格区域 -->

      <el-table border stripe :data="userListObj.users">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column min-width="120px" label="姓名" prop="username"></el-table-column>
        <el-table-column min-width="140px" label="邮箱" prop="email"></el-table-column>
        <el-table-column min-width="120px" label="电话" prop="mobile"></el-table-column>
        <el-table-column min-width="120px" label="角色" prop="role_name"></el-table-column>
        <el-table-column min-width="120px" label="状态">
          <!-- 状态区域 -->
          <template slot-scope="scope">
            <el-switch
              @change="switchChange(scope.row.id, $event)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#DCDFE6"
              :active-value="true"
              :inactive-value="false"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作区域 -->
        <el-table-column label="操作" width="220px">
          <template slot-scope="scope">
            <el-button
              @click="editUserHandle(scope.row)"
              type="primary"
              size="mini"
            >
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button
              @click="deleteUser(scope.row.id)"
              type="danger"
              size="mini"
            >
              <i class="el-icon-delete"></i>
            </el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                @click="setCharactorHandle(scope.row)"
                type="warning"
                size="mini"
              >
                <i class="el-icon-setting"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        :page-size="getUserListParams.pagesize"
        :page-sizes="[3, 5, 10]"
        :current-page="userListObj.pagenum"
        :total="userListObj.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="eidtDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        ref="editForm"
        :rules="editRules"
        :model="editForm"
        label-width="80px"
      >
        <el-form-item label="用户名: " prop="userName">
          <el-input v-model="editForm.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱: " prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话: " prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirmHandle">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      @close="addUserDialogClose"
    >
      <el-form
        ref="addForm"
        :rules="addRules"
        :model="addForm"
        label-width="80px"
      >
        <el-form-item label="用户名: " prop="username">
          <el-input
            placeholder="用户名长度在 6 - 12 个字符之间"
            v-model="addForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码: " prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱: " prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话: " prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setUserDialogVisible"
      width="50%"
      @close="setUserClose"
    >
      <div>
        <div class="nowUser">当前用户: {{ setUserForm.nowUser }}</div>
        <div class="nowUser">当前角色: {{ setUserForm.nowCharactor }}</div>
        <div class="nowUser">
          分配新角色:
          <el-select v-model="setUserForm.rid" placeholder="请选择">
            <el-option
              v-for="item in charactorListData"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUserConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  userList,
  changeUserState,
  deleteUser,
  editUser,
  addUser,
  charactorList,
  setCharactor,
} from "network/userManage/userList";

export default {
  data() {
    const checkEmail = (rule, value, callback) => {
      const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!value) {
        callback();
      } else if (!emailReg.test(value)) {
        callback(new Error("邮箱格式有误，请检查"));
      } else {
        callback();
      }
    };

    const checkMobile = (rule, value, callback) => {
      const mobileReg = /^1[3456789]\d{9}$/;
      if (!value) {
        callback();
      } else if (!mobileReg.test(value)) {
        callback(new Error("手机号码格式有误，请检查"));
      } else {
        callback();
      }
    };

    return {
      // 保存用户列表的数据
      userListObj: {
        pagenum: null,
        total: null,
        users: [],
      },
      // 控制 switch 开关是开还是关
      isOpen: true,
      // 控制编辑对话框的显示
      eidtDialogVisible: false,
      // 控制添加用户对话框的显示
      addUserDialogVisible: false,
      // 控制分配角色对话框的显示
      setUserDialogVisible: false,
      // 保存请求数据列表的参数
      getUserListParams: {
        query: "",
        pagenum: 1,
        pagesize: 3,
      },
      // 保存编辑表单的数据
      editForm: {
        userName: "",
        email: "",
        mobile: "",
        id: "",
      },
      // 保存添加用户的表单项
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 定义编辑表单中的表单验证规则
      editRules: {
        email: [
          { required: true, message: "email 不能为空", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "电话 不能为空", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 定义 添加用户表单中的验证规则
      addRules: {
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度在 6 - 16 个字符之间",
            trigger: "blur",
          },
        ],
        username: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "用户名长度在 6 - 12 个字符之间",
            trigger: "blur",
          },
        ],
      },
      // 保存分配角色的表单
      setUserForm: {
        id: "", // 用户 id
        rid: "", // 角色 rid
        nowUser: "",
        nowCharactor: "",
      },
      // 保存角色列表数据
      charactorListData: [],
    };
  },
  created() {
    // 请求用户列表数据
    this.getUserListData();
  },
  methods: {
    // 数据请求
    // 请求用户列表数据
    async getUserListData() {
      const { data: res } = await userList(this.getUserListParams);
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.userListObj = res.data;
    },
    // 请求修改用户状态
    async changeUserStatePut(uid, type) {
      const { data: res } = await changeUserState(uid, type);
      if (res.meta.status !== 200) return this.$message.error("修改失败");
      this.$message.success("授权成功");
    },
    // 删除用户请求
    async deleteUserPut(uid) {
      const { data: res } = await deleteUser(uid);
      if (res.meta.status !== 200) return this.$message.error("请求删除失败");
      this.$message.success("删除用户成功");
      this.getUserListData();
    },
    // 编辑用户请求
    async editUserPut() {
      const { data: res } = await editUser(this.editForm);
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      this.$message.success("编辑用户成功");
      this.getUserListData();
    },
    // 添加用户的请求
    async addUserInput() {
      const { data: res } = await addUser(this.addForm);
      if (res.meta.status !== 201) return this.$message.error("请求数据失败");
      this.$message.success("添加用户成功");
      this.getUserListData();
    },
    async getCharactorList() {
      const { data: res } = await charactorList();
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      this.charactorListData = res.data;
      console.log(this.charactorListData);
    },
    async setCharactorPut() {
      const { data: res } = await setCharactor(this.setUserForm);
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("请求失败");
      this.$message.success("修改角色成功");
      this.getUserListData();
    },
    // 事件监听
    // 监听搜索按钮点击
    searchClickHandle() {
      this.getUserListParams.pagenum = 1;
      console.log(this.getUserListParams);
      this.getUserListData();
    },
    // 监听添加用户按钮点击
    addUserHandle() {
      this.addUserDialogVisible = true;
    },
    // 监听 分页的 每页展示个数的变化
    handleSizeChange(size) {
      this.getUserListParams.pagesize = size;
      this.getUserListData();
    },
    // 监听分页的当前页数发生变化
    handleCurrentChange(num) {
      this.getUserListParams.pagenum = num;
      this.getUserListData();
    },
    // 监听 切换按钮的切换
    switchChange(uid, value) {
      this.changeUserStatePut(uid, value);
    },
    // 监听删除按钮的点击
    async deleteUser(uid) {
      const res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      // console.log(res)
      if (res !== "confirm") return this.$message("取消删除");
      this.$message.success("删除成功");
      this.deleteUserPut(uid);
      // .then(() => {
      //   this.deleteUserPut(uid);
      // })
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "已取消删除",
      //   });
      // });
    },
    // 监听编辑用户按钮点击
    editUserHandle(node) {
      this.editForm.userName = node.username;
      this.editForm.email = node.email;
      this.editForm.mobile = node.mobile;
      this.editForm.id = node.id;
      this.eidtDialogVisible = true;
    },
    // 监听编辑用户对话框的关闭(关闭之前重置对话框)
    editDialogClose() {
      this.$refs.editForm.resetFields();
    },
    // 监听编辑对话框的确定按钮点击
    editConfirmHandle() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) return false;
        this.editUserPut();
        // 更新视图
        this.eidtDialogVisible = false;
      });
    },
    // 监听添加用户对话框的关闭
    addUserDialogClose() {
      this.$refs.addForm.resetFields();
    },
    // 监听添加用户对话框的确认点击
    addUserConfirm() {
      this.$refs.addForm.validate((valid) => {
        if (!valid) return this.$message.error("请求数据失败");
        this.addUserInput();
        this.addUserDialogVisible = false;
      });
    },
    // 监听分配角色按钮的点击
    setCharactorHandle(node) {
      // 请求当前的角色列表
      this.getCharactorList();
      console.log(node);
      this.setUserForm.id = node.id;
      this.setUserForm.nowCharactor = node.role_name;
      this.setUserForm.nowUser = node.username;
      this.setUserDialogVisible = true;
    },
    // 监听分配对话框的确定点击
    setUserConfirm() {
      if (!this.setUserForm.rid) return this.$message.error("请选择角色");
      this.setCharactorPut();
      this.setUserDialogVisible = false;
    },
    // 监听分配对话框的退出
    setUserClose() {
      // 重置分配表单的 id 和 uid
      this.setUserForm.id = "";
      this.setUserForm.rid = "";
    },
    // 监听搜索用户框中的清除点击
    searchClear() {
      this.getUserListData();
    },
  },
};
</script>

<style lang='less' scoped>
.searchUser {
  margin-left: 20px;
}

.el-table {
  margin-top: 20px;
}

.nowUser {
  font-size: 16px;
  margin-top: 15px;
}

.input {
  width: 400px;
}

.inputBox {
  width: 600px;
}
</style>