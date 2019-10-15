<template>
  <div class="login">
    <el-form ref="form" status-icon :model="form" :rules="rules" label-width="80px">
      <img class="logo" src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
      <el-button @click="login" class="loginBtn" type="primary">登陆</el-button>
      <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
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
    login () {
      this.$refs.form.validate(isValid => {
        // console.log(isValid)
        if (!isValid) return
        // console.log('发送ajax请求')
        // axios({
        //   method: 'post',
        //   url: 'http://localhost:8888/api/private/v1/login',
        //   data: this.form
        // }).then(res => {
        //   // console.log(res.data)
        //   const { meta } = res.data
        //   if (meta.status === 200) {
        //     console.log(meta.msg)
        //   } else {
        //     // 失败了
        //     console.log(meta.msg)
        //   }
        // })
        // })
        axios.post('http://localhost:8888/api/private/v1/login', this.form).then(res => {
          const { meta } = res.data
          if (meta.status === 200) {
            // console.log(meta.msg)
            this.$message({
              type: 'success',
              message: meta.msg,
              duration: 1000
            })
            this.$router.push({ name: 'index' })
          } else {
            // 失败了
            // console.log(meta.msg)
            this.$message.error(meta.msg)
          }
        })
      })
    }
  }
}

// const obj = {
//   name: 'zs'
// }
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
