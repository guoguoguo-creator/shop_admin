<template>
  <div class="users">
    <el-table
    :data="userList"
    style="width: 100%">

    <el-table-column prop="username" label="姓名"></el-table-column>
    <el-table-column prop="email" label="邮箱"></el-table-column>
    <el-table-column prop="mobile" label="电话"></el-table-column>
    <el-table-column label="用户状态">
      <template v-slot:default="obj">
        <!-- {{ obj.row.mg_state }} -->
        <el-switch
          v-model="obj.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <el-button size="small" plain icon="el-icon-edit" type="primary"></el-button>
      <el-button size="small" plain icon="el-icon-delete" type="danger"></el-button>
      <el-button size="small" plain icon="el-icon-check" type="success">分配角色</el-button>
    </el-table-column>

  </el-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 4,
      userList: []
    }
  },
  methods: {
    getUserList () {
      axios.get('http://localhost:8888/api/private/v1/users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        // console.log(res.data)
        const { meta, data } = res.data
        if (meta.status === 200) {
          this.userList = data.users
          console.log(this.userList)
        } else {
          this.$message.error(meta.msg)
        }
      })
    }
  }
}
</script>

<style>

</style>
