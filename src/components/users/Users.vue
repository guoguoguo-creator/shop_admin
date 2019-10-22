<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button @click="showAddDialog" class="addBtn" type="success" plain>添加用户</el-button>

    <!-- 表格 -->
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
        @change="changeState(obj.row)"
          v-model="obj.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>

    <el-table-column label="操作">
      <template v-slot:default="obj">
        <el-button @click="showEditDialog(obj.row)" size="small" plain icon="el-icon-edit" type="primary"></el-button>
        <el-button @click="delUser(obj.row.id)" size="small" plain icon="el-icon-delete" type="danger"></el-button>
        <el-button @click="showAssignDialog(obj.row)" size="small" plain icon="el-icon-check" type="success">分配角色</el-button>
      </template>
    </el-table-column>

  </el-table>

<!-- 分页 -->
  <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
  </el-pagination>

     <!-- 修改 对话框 -->
    <el-dialog
    title="修改用户"
    :visible.sync="editVisible"
    width="40%">
      <el-form status-icon ref="editForm" :rules="rules" :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{ editForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部的内容 -->
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button @click="editUser" type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>

      <!-- 添加用户 对话框 -->
      <el-dialog
      @close="closeDialog"
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form status-icon ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部的内容 -->
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button @click="addUser" type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配的对话框 -->
    <el-dialog
    title="分配角色"
    :visible.sync="assignVisible"
    width="40%">
      <el-form :model="assignForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{ assignForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部的内容 -->
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="assignVisible = false">取 消</el-button>
          <el-button @click="assignRole" type="primary">分 配</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      userList: [],
      total: 0,
      dialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入邮箱', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      },
      editVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      assignVisible: false,
      assignForm: {
        username: '',
        id: '',
        rid: ''
      },
      options: []
    }
  },
  methods: {
    async getUserList () {
      const { meta, data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(res.data)
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
        // console.log(this.userList)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 切换当前页时触发
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      // 将当前页更新成第一页
      this.pagenum = 1
      // 重新渲染
      this.getUserList()
    },
    // 当前页变化时, 触发
    handleCurrentChange (val) {
      // val 用户选择的当前页
      this.pagenum = val
      // 重新渲染
      this.getUserList()
    },
    search () {
      this.pagenum = 1
      this.getUserList()
    },
    async delUser (id) {
      try {
        await this.$confirm('亲，你确认要进行删除么？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async changeState (row) {
      try {
        const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showAddDialog () {
      this.dialogVisible = true
    },
    closeDialog () {
      // console.log('对话框关闭了')
      this.$refs.form.resetFields()
    },
    async addUser () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        if (meta.status === 201) {
          this.$message.success('添加成功')
          this.dialogVisible = false
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showEditDialog (row) {
      this.editVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    async editUser () {
      try {
        await this.$refs.editForm.validate()
        const { id, email, mobile } = this.editForm
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.editVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async showAssignDialog (row) {
      this.assignVisible = true
      this.assignForm.id = row.id
      this.assignForm.username = row.username
      // this.assignForm.rid = row.rid
      const resUser = await this.$axios.get(`users/${row.id}`)
      if (resUser.meta.status === 200) {
        const rid = resUser.data.rid
        this.assignForm.rid = rid === -1 ? '' : rid
        // this.assignForm.rid = resUser.data.rid
      }
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRole () {
      const { rid, id } = this.assignForm
      if (this.assignForm.rid === '') {
        this.$message.error('请选择角色进行分配')
        return
      }
      const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.assignVisible = false
        this.getUserList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.users {
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addBtn {
    margin-left: 10px;
  }
}
</style>
