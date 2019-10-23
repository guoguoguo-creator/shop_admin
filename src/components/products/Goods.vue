<template>
<div class="goods">
  <el-button @click="goAdd" class="addBtn" type="success" plain>添加商品</el-button>
      <!-- 表格 -->
  <el-table :data="goodList">
    <el-table-column :index="indexMethod" type="index"></el-table-column>
    <el-table-column label="商品名称" prop="goods_name"></el-table-column>
    <el-table-column label="商品价格" prop="goods_price"></el-table-column>
    <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
    <el-table-column label="创建时间" prop="add_time">
      <template v-slot:default="{ row }">
        {{ row.add_time | time }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <el-button icon="el-icon-edit" plain type="primary" size="small"></el-button>
      <el-button icon="el-icon-delete" plain type="danger" size="small"></el-button>
    </el-table-column>
  </el-table>
        <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</div>
</template>

<script>
export default {
  data () {
    return {
      pagenum: 1,
      pagesize: 5,
      goodlist: [],
      total: 0
    }
  },
  created () {
    this.getGoodList()
  },
  methods: {
    async getGoodList () {
      const { meta, data } = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.goodList = data.goods
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getGoodList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodList()
    },
    indexMethod (index) {
      return index + 1 + (this.pagenum - 1) * this.pagesize
    },
    goAdd () {
      this.$router.push('/goods-add')
    }
  }
}
</script>

<style lang="scss" scoped>
.goods {
  .addBtn {
    margin-bottom: 10px;
  }
}
</style>
