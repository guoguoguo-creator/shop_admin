<template>
    <el-container class="index">
      <el-header>
        <div class="logo">
          <img src="../assets/logo.png" alt="">
        </div>
        <div class="title">
          <h1>电商后台管理系统</h1>
        </div>
        <div class="logout">
          欢迎光临~
          <a @click="logout" href="javascript:;">退出</a>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            unique-opened
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span slot="title">用户列表</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item index="2-1">
                <i class="el-icon-menu"></i>
                <span slot="title">角色列表</span>
              </el-menu-item>
              <el-menu-item index="2-2">
                <i class="el-icon-menu"></i>
                <span slot="title">权限列表</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-main>Main</el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$confirm('亲，你确认要退出系统么?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('恭喜，退出成功')
        localStorage.removeItem('token')
        this.$router.push('/login')
        console.log('确认')
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss">
.index {
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
    display: flex;
    .logo {
      width: 180px;
      img {
        height: 40px;
        margin: 10px;
      }
    }
    .title {
      flex: 1;
      h1 {
      text-align: center;
      height: 60px;
      line-height: 60px;
      color: #545c64;
      }
    }
    .logout {
      width: 180px;
      text-align: right;
      font-weight: 700;
      height: 60px;
      line-height: 60px;
      a {
        color: orange;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-menu {
      border: none;
    }
  }
  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
