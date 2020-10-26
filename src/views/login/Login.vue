<template>
  <div id="login">
    <div class="loginFrom">
      <!-- 图片位置 -->
      <div class="loginImgWrapper">
        <div class="loginImgContent"></div>
      </div>

      <!-- 登录的表单 -->
      <el-form
        class="loginForm"
        ref="loginForm"
        :model="loginForm"
        :rules="loginFormRule"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
            placeholder="用户名在 5 - 15 个字符之间"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
            show-password
            placeholder="密码在 6 - 20 个字符之间"
          ></el-input>
        </el-form-item>

        <el-row class="buttonBpx">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetFields">重置</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { userLogin } from "network/login/uerLogin";

export default {
  data() {
    return {
      // 表单验证项
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRule: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 15,
            message: "长度在 5 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 表单重置
    resetFields() {
      this.$refs.loginForm.resetFields();
    },
    // 表单登录
    login() {
      // 表单预验证
      this.$refs.loginForm.validate((valid) => {
        // 验证不通过
        if (!valid) return;
        // 通过验证
        this.getUserLogin();
      });
    },
    // 登录请求
    async getUserLogin() {
      const { data: res } = await userLogin(this.loginForm);
      // 将令牌保存在 session 中:
      window.sessionStorage.setItem("token", res.data.token);
      // 跳转到 home 界面
      this.$router.push("/home");
      this.$message.success('登录成功')
    },
  },
};
</script>

<style lang='less' scoped>
.loginFrom {
  padding: 20px;
  width: 540px;
  height: 320px;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.loginImgWrapper {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -85px);
  width: 150px;
  height: 150px;
  border-radius: 50%;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #ddd;
}

.loginImgContent {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: url(~assets/img/tokisaki3.png) no-repeat;
  background-size: cover;
}

.loginForm {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.buttonBpx {
  display: flex;
  justify-content: flex-end;
}
</style>