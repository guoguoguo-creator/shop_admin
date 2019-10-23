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
            router
            :default-active="defaultActive"
            unique-opened
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">

            <el-submenu :index="menu.path" v-for="menu in menuList" :key="menu.id">
              <!-- 配置导航的标题 -->
              <template v-slot:title>
                <i class="el-icon-location"></i>
                <span>{{ menu.authName }}</span>
              </template>
              <!-- 配置展开的内容, 配置的路径, 将来会被当成绝对路径 -->
              <el-menu-item :index="item.path" v-for="item in menu.children" :key="item.id">
                <i class="el-icon-menu"></i>
                <span slot="title">{{ item.authName }}</span>
              </el-menu-item>
            </el-submenu>

          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>

      </el-container>
    </el-container>
</template>

<script>
export default {
  computed: {
    defaultActive () {
      return this.$route.path.slice(1).split('-')[0]
    }
  },
  data () {
    return {
      menuList: []
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('menus')
    if (meta.status === 200) {
      this.menuList = data
      // console.log(this.menuList)
    } else {
      this.$message.error(meta.msg)
    }
  },
  methods: {
    logout () {
      this.$confirm('亲，你确认要退出系统么?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('恭喜，退出成功')
        localStorage.removeItem('token')
        this.$router.push('/login')
        // console.log('确认')
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss">
.index {
  .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
}
</style>

<style lang="scss" scoped>
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
