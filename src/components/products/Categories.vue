<template>
  <div class="categories">
    <el-button @click="showAddDialog" class="addBtn" plain type="success">添加分类</el-button>
    <el-table
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      v-loading="isShow" row-key="cat_id" :data="categoryList">
      <el-table-column label="分类名称" prop="cat_name"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot:default="{ row }">
          {{ row.cat_deleted ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button icon="el-icon-edit" plain size="small" type="primary"></el-button>
          <el-button icon="el-icon-delete" plain size="small" type="danger"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pagenum"
      :page-size="pagesize"
      :page-sizes="[5, 10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog
      @close="closeDialog"
      title="添加分类"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form status-icon :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input placeholder="请输入分类名称" v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            clearable
            :props="props"
            v-model="form.cat_pid"
            :options="options">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="addCategory" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getCategoryList()
  },
  data () {
    return {
      isShow: false,
      pagenum: 1,
      pagesize: 5,
      categoryList: [],
      total: 0,
      dialogVisible: false,
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      },
      form: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  methods: {
    async getCategoryList () {
      this.isShow = true
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.categoryList = data.result
        this.total = data.total
        console.log(this.total)
        console.log(this.categoryList)
      } else {
        this.$message.error(meta.msg)
      }
      this.isShow = false
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoryList()
    },
    async showAddDialog () {
      this.dialogVisible = true
      const { meta, data } = await this.$axios.get('categories?type=2')
      if (meta.status === 200) {
        this.options = data
        console.log(this.options)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async addCategory () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1] || 0,
          cat_name: this.form.cat_name,
          cat_level: this.form.cat_pid.length
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogVisible = false
          this.getCategoryList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.addBtn {
  margin-bottom: 10px;
}
</style>
