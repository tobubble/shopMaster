<template>
  <div>
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-button type="primary" @click="addCharactorHandle"
          >添加角色</el-button
        >
      </el-row>

      <!-- 角色列表表格 -->
      <el-table stripe border :data="charactorList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              class="border_top border_bottom"
              v-for="item1 in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable>{{ item1.authName }} </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col>
                <el-row
                  class="border_top2"
                  v-for="item2 in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8">
                    <el-tag type="success" closable>{{
                      item2.authName
                    }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col>
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="editCharactorHandle(scope.row)"
              size="mini"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="deleteCharactorHandle(scope.row)"
              >删除</el-button
            >
            <el-button
              @click="setAuthorityHandle(scope.row)"
              type="warning"
              size="mini"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="eidtDialogVisible"
      width="50%"
      @close="editClose"
    >
      <el-form
        ref="editForm"
        label-width="100px"
        :model="editCharactorForm"
        :rules="editRules"
      >
        <el-form-item label="角色名称: " prop="roleName">
          <el-input v-model="editCharactorForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述: " prop="roleDesc">
          <el-input v-model="editCharactorForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtFormConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addClose"
    >
      <el-form
        ref="addForm"
        label-width="100px"
        :model="addCharactorForm"
        :rules="addRules"
      >
        <el-form-item label="角色名称: " prop="roleName">
          <el-input v-model="addCharactorForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述: " prop="roleDesc">
          <el-input v-model="addCharactorForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog @close="setClose" title="分配权限" :visible.sync="setDialogVisible" width="50%">
      <el-tree
        ref="trees"
        :data="authorityTree"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="authoTreeProps"
        :default-checked-keys="expandKeyArr"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setFormConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCharactorList,
  editCharactor,
  deleteCharactor,
  addCharactor,
  getAuthorityTree,
  searchAuthorityById,
  setAuthority
} from "network/authorityManage/charactorList";

export default {
  data() {
    return {
      // 保存角色列表信息
      charactorList: [],
      // 保存编辑角色表单
      editCharactorForm: {
        id: "",
        roleName: "",
        roleDesc: "",
      },
      // 控制编辑对话框的显示
      eidtDialogVisible: false,
      // 保存编辑表单的验证规则
      editRules: {
        roleName: [
          { required: true, message: "角色名称不能为空", triggle: "blur" },
        ],
      },
      // 保存要删除的角色的 id
      deleteId: "",
      // 添加角色的的表单
      addCharactorForm: {
        roleName: "",
        roleDesc: "",
      },
      // 添加角色表单的验证
      addRules: {
        roleName: [
          { required: true, message: "角色名称不能为空", triggle: "blur" },
        ],
      },
      // 控制添加对话框的显示
      addDialogVisible: false,
      // 分配权限对话框的显示
      setDialogVisible: false,
      // 保存权限列表树
      authorityTree: [],
      // 定义权限树的展示规则
      authoTreeProps: {
        label: "authName",
        children: "children",
      },
      // 权限树的默认展开 key 数组
      expandKeyArr: [],
      // 角色授权的表单
      setAuthorityForm: {
        uid: '',
        rids: ''
      } ,
    };
  },
  created() {
    this.getCharactorListPut();
  },
  methods: {
    // 数据请求
    // 请求角色列表数据
    async getCharactorListPut() {
      const { data: res } = await getCharactorList();
      if (res.meta.status !== 200) this.$message.error("请求数据失败");
      this.charactorList = res.data;
      console.log(this.charactorList);
    },

    // 请求编辑角色列表
    async editCharactorPut() {
      const { data: res } = await editCharactor(this.editCharactorForm);
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      this.$message.success("编辑角色成功");
      this.getCharactorListPut();
    },

    // 请求删除角色
    async deleteCharactorPut() {
      const { data: res } = await deleteCharactor(this.deleteId);
      if (res.meta.status !== 200) return this.$message.error("请求删除失败");
      this.$message.success("删除角色成功");
      this.getCharactorListPut();
    },
    // 请求添加角色
    async addCharactorPut() {
      const { data: res } = await addCharactor(this.addCharactorForm);
      if (res.meta.status !== 201)
        return this.$message.error("请求添加角色失败");
      this.getCharactorListPut();
      this.$message.success("添加角色成功");
    },

    // 请求获取权限列表树
    async getAuthorityTreePut() {
      const { data: res } = await getAuthorityTree();
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      this.authorityTree = res.data;
      this.setDialogVisible = true;
      console.log(this.authorityTree);
    },
    // 请求查询角色权限
    async searchAuthorityByIdPut() {
      const { data: res } = await searchAuthorityById(this.searchId);
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      this.searchCharactorInfo = res.data;
      console.log(this.searchCharactorInfo);
    },
    // 请求角色授权
    async setAuthorityPut() {
      const {data: res} = await setAuthority(this.setAuthorityForm)
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('授权失败')
      this.getCharactorListPut()
      this.$message.success('授权成功')
    },

    // 事件监听
    editCharactorHandle(node) {
      this.editCharactorForm.roleName = node.roleName;
      this.editCharactorForm.id = node.id;
      this.eidtDialogVisible = true;
    },
    // 监听编辑角色对话框的关闭
    editClose() {
      this.$refs.editForm.resetFields();
    },
    // 监听编辑角色对话框的确定
    eidtFormConfirm() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) return;
        this.editCharactorPut();
        this.eidtDialogVisible = false;
      });
    },
    // 监听删除角色的按钮点击
    deleteCharactorHandle(node) {
      this.deleteId = node.id;
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteCharactorPut();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 监听添加角色的点击
    addCharactorHandle() {
      this.addDialogVisible = true;
    },
    // 监听添加角色对话框关闭
    addClose() {
      this.$refs.addForm.resetFields();
    },
    // 监听添加角色对话框的确定
    addFormConfirm() {
      this.$refs.addForm.validate((valid) => {
        if (!valid) return;
        this.addCharactorPut();
        this.addDialogVisible = false;
      });
    },
    // 监听分配角色对话框的点击
    setAuthorityHandle(node) {
      this.setAuthorityForm.uid = node.id
      // 清空选中的数组
      this.expandKeyArr = []
      // 使用递归
      this.getThirdAuthority(node.children)
      this.setAuthorityForm.rids = this.expandKeyArr.join(',')
      this.getAuthorityTreePut();
    },
    // 监听设置权限对话框的确定
    setFormConfirm() {
      const halfCheckArr = this.$refs.trees.getHalfCheckedKeys()
      const checkArr = this.$refs.trees.getCheckedKeys()
      this.setAuthorityForm.rids = [...halfCheckArr, ...checkArr].join(',')
      this.setAuthorityPut()
      this.setDialogVisible = false
    },
    // 监听分配权限对话框的关闭
    setClose() {
      this.setAuthorityForm.uid = ''
      this.setAuthorityForm.rids = ''
    },

    // 自定义方法
    // 利用递归获取三级权限
    getThirdAuthority(node) {
      // 遍历这个节点
      node.forEach(item => {
        // 不包子节点
        if(!item.children){
          this.expandKeyArr.push(item.id)
        } else {
          //包含子节点
          this.getThirdAuthority(item.children)
        }
      })
      //
    }
  },
};
</script>

<style lang='less' scoped>
.el-table {
  margin-top: 20px;
}

.el-tag {
  margin: 8px;
}

.el-row {
  display: flex;
  align-items: center;
}

.border_top {
  border-top: 1px solid #eee;
  padding: 12px 0;
}

.border_bottom:last-child {
  border-bottom: 1px solid #eee;
}

.border_top2:not(:first-child) {
  border-top: 1px solid #eee;
}

.border_top2 {
  padding: 10px 0;
}
</style>