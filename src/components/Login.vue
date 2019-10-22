<template>
  <div class="login">
    <el-form ref="form" status-icon :model="form" :rules="rules" label-width="80px">
      <img class="logo" src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
      <el-button @click="login" class="loginBtn" type="primary">登陆</el-button>
      <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    async login () {
      try {
        await this.$refs.form.validate
        const { meta, data } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          this.$message({
            type: 'success',
            message: meta.msg,
            duration: 1000
          })
          this.$router.push({ name: 'index' })
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
}
.el-form {
  width: 400px;
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  padding-top: 75px;
  margin: 0 auto;
  margin-top: 200px;
  position: relative;

  .logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -75px;
  border-radius: 50%;
  border: 5px solid #fff;
}
.loginBtn {
  margin-right: 70px;
}
}

</style>
