<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
<!-- 添加按钮 -->
    <el-button @click="showAddDialog" class="addBtn" type="success" plain>添加角色</el-button>
<!-- 表格 -->
    <el-table :data="roleList">
      <el-table-column type="expand">
        <template v-slot:default="{ row }">
          <p v-if="row.children.length === 0">暂无权限</p>
          <!-- row 是一条遍历的数据, 就是一个角色, row.children是全部的一级权限数组 -->
          <!-- 每个一级都应该先展示出一行 -->
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag @close="delRights(row, l1.id)" closable>{{ l1.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 每个二级应该展示一行 -->
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag @close="delRights(row, l2.id)" closable type="success">{{ l2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 每个三级直接就是一个el-tag -->
                  <el-tag @close="delRights(row, l3.id)" class="l3" closable type="warning" v-for="l3 in l2.children" :key="l3.id">{{ l3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button @click="showEditDialog(row)" icon="el-icon-edit" size="small" plain type="primary"></el-button>
          <el-button @click="delRole(row.id)" icon="el-icon-delete" size="small" plain type="danger"></el-button>
          <el-button @click="showAssignDialog(row)" icon="el-icon-check" size="small" plain type="success">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配的模态框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignVisible"
      width="40%">

      <el-tree ref="tree" node-key="id" show-checkbox default-expand-all :data="data" :props="defaultProps"></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button @click="assignRights" type="primary">分 配</el-button>
      </span>
    </el-dialog>

    <!-- 添加的模态框 -->
    <el-dialog
      @close="closeDialog"
      :title="dialogTitle"
      :visible.sync="addVisible"
      width="40%">
      <el-form status-icon ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" palceholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc" palceholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button @click="saveRole" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      assignVisible: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      addVisible: false,
      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }
        ]
      },
      dialogTitle: '添加角色'
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data, meta } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.roleList = data
        // console.log(this.roleList)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRights (row, rightId) {
      const { data, meta } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      console.log(data)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async showAssignDialog (row) {
      this.roleId = row.id
      this.assignVisible = true
      const { meta, data } = await this.$axios.get(`rights/tree`)
      if (meta.status === 200) {
        this.data = data
        // console.log(this.data)
        // this.$refs.tree.setCheckedKeys([101])
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRights () {
      const ids = this.$refs.tree.getCheckedKeys()
      const halfIds = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...halfIds].join(',')
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.assignVisible = false
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRole (id) {
      try {
        await this.$confirm('亲，你确认要进行删除操作么?', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRoleList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showAddDialog () {
      this.addVisible = true
      this.dialogTitle = '添加角色'
    },
    showEditDialog (row) {
      this.addVisible = true
      this.dialogTitle = '修改角色'
      // console.log(row)
      this.$nextTick(() => {
        this.form.id = row.id
        this.form.roleName = row.roleName
        this.form.roleDesc = row.roleDesc
      })
    },
    closeDialog () {
      this.$refs.form.resetFields()
    },
    async saveRole () {
      const isAdd = this.dialogTitle === '添加角色'
      const url = isAdd ? 'roles' : `roles/${this.form.id}`
      const method = isAdd ? 'post' : 'put'
      const { meta } = await this.$axios[method](url, this.form)
      if (meta.status === 200 || meta.status === 201) {
        this.$message.success('操作成功')
        this.addVisible = false
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.roles {
  .addBtn {
    margin-bottom: 10px;
  }
  .li {
    margin-bottom: 5px;
    border-bottom: 1px dotted #ccc;
  }
  .l2 {
    margin-bottom: 5px;
  }
  .l3 {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>
