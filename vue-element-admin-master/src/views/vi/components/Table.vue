<template>
    <div>
       <Search  @channelSearch='channelSearch' />
       <!-- 我是表格组件 -->
      <div class="bigBoxs">
          <el-table class="tableBox" v-loading="listLoading" :key="tableKey"  :data="gridDatas" border fit @selection-change="handleSelectionChange"  highlight-current-row style="width:100%;">
            <el-table-column  align="center" type="selection" width="55"></el-table-column>
            <el-table-column property="create_at" label="创建日期"  align="center" ></el-table-column>
            <el-table-column property="guarantee_number" label="担保账户编号"  align="center"></el-table-column>
            <el-table-column property="guarantee_name" label="担保账户名称"  align="center"></el-table-column>
            <el-table-column property="merchant_name" label="商户名称"  align="center"></el-table-column>
            <!-- <el-table-column property="sonSotreName" label="子商户"  align="center"></el-table-column> -->
            <el-table-column property="channel_name" label="所属渠道商"  align="center"></el-table-column>
            <el-table-column label="充值金额"  align="center"  width="95%">
              <template slot-scope="scope">
                <span type="text" size="small" class="moneyStyles">￥{{scope.row.recharge_amount.toString()| toThousandFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="赠送金额"  align="center"  width="90%">
               <template slot-scope="scope">
                <span type="text" size="small" class="moneyStyles">￥{{scope.row.gift_amount.toString()| toThousandFilter}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column  label="充值数量"  align="center"  width="80%">
               <template slot-scope="scope">
                 <span type="text" size="small" class="moneyStyles">{{scope.row.rechargeNum| toThousandFilter}}</span>
               </template>
            </el-table-column>
            <el-table-column label="充值总额"  align="center"  width="95%">
               <template slot-scope="scope">
                <span type="text" size="small" class="moneyStyles">￥{{scope.row.rechargeAllMoney| toThousandFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="赠送总额"  align="center"  width="90%">
                <template slot-scope="scope">
                  <span type="text" size="small" class="moneyStyles">￥{{scope.row.giveAllMoney| toThousandFilter}}</span>
              </template>
            </el-table-column> -->
            <el-table-column  label="状态"  align="center" width="80%" >
              <template slot-scope="scope">
                <span type="text" size="small" class="ppss"  v-if="scope.row.status" >上架中</span>
                <span type="text" size="small" class="noppss" v-else>已下架</span>
                <!-- <span type="text" size="small" class="stopServer" v-if="scope.row.status==2">暂停服务</span> -->
              </template>
            </el-table-column>         
            <el-table-column  label="操作"   align="center" width="90%">
              <template slot-scope="scope" >
                <el-button @click="passsubmit(scope.row)" type="text" size="small" class="xiaz" >详情</el-button>
                <!-- <el-button type="text" size="small" class="shanchu">修改</el-button> -->
              </template>
            </el-table-column>       
    </el-table>
    <!-- 下面的选择按钮 -->
     <div class="allChose">
       <el-button v-waves class="searchs" plain type="primary" @click="jihuoJump">批量上架</el-button>
       <el-button v-waves class="searchs" plain  @click="passJump">批量下架</el-button>
       <el-button v-waves class="searchs" type="danger" plain  @click="stopServes">暂停服务</el-button>
       <el-button v-waves class="searchs"  icon="el-icon-plus"  @click="AddJump">添加</el-button>
       <el-button v-waves class="searchs" type="primary"  icon="el-icon-download"  @click="daochuJump">导出</el-button>
      </div> 
    </div>
     <!-- 分页功能 -->
    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="pages.page" :page-sizes="[10,20,30, 50]" :page-size="10" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <!-- 主体内容结束 -->

     <!-- 下面是详情模态框啊 -->
      <el-dialog :visible.sync="dialogTableVisible" custom-class='sssss'   width="500px" >
          <div class="diaTilte"><div class="titleMotai">账户信息</div>
              <div class="item"><div class="abs">创建日期：</div><span>{{detailMsg.create_at}}</span></div>
              <div class="item"><div class="abs">账户编号：</div><span>{{detailMsg.guarantee_number}}</span></div>
              <div class="item"><div class="abs">账户名称：</div><span>{{detailMsg.guarantee_name}}</span></div>
              <div class="item"><div class="abs">优惠时段：</div><span>{{detailMsg.offer_time}}</span></div>              
              <div class="item"><div class="abs">充值金额：</div><span>￥{{detailMsg.recharge_amount}}</span></div>
              <div class="item"><div class="abs">赠送金额：</div><span>￥{{detailMsg.gift_amount}}</span></div>
              <div class="item"><div class="abs">违约赔付比例：</div><span>{{detailMsg.promise_rate}}%</span></div>
              <!-- <div class="item"><div class="abs">优惠是否自动翻倍：</div><span>是</span></div>
              <div class="item"><div class="abs">到期是否自动下架：</div><span>是</span></div> -->
          </div>

          <div class="diaTilte title2"><div class="titleMotai">账户状态</div>
              <div class="item"><div class="abs">账户状态：</div>
              <span class="shangjia" v-if="detailMsg.status">上架中</span>
              <span class="shangjia" v-else>已下架</span>
              </div>
              <!-- <div class="item"><div class="abs">充值数量：</div><span>998</span></div>
              <div class="item"><div class="abs">充值总额：</div><span>￥99999.99</span></div>
              <div class="item"><div class="abs">赠送总额：</div><span>￥29999.99</span></div>
              <div class="item"><div class="abs">剩余总额：</div><span>￥8000.90</span></div>
              <div class="item"><div class="abs">剩余赠送：</div><span>￥1000.00</span></div> -->
          </div>
            
          <div class="diaTilte title2"><div class="titleMotai">商家信息</div>
              <div class="item"><div class="abs">商家类型：</div><span class="">{{detailMsg.merchant_type}}</span></div>
              <div class="item"><div class="abs">商家名称：</div><span>{{detailMsg.merchant_name}}</span></div>
              <div class="item"><div class="abs">商家编号：</div><span>{{detailMsg.merchant_id}}</span></div>
              <div class="item"><div class="abs">使用门店：</div><span>{{detailMsg.merchant_name}}</span></div>
              <div class="item"><div class="abs">所属渠道商名称：</div><span>{{detailMsg.channel_name}}</span></div>
              <div class="item"><div class="abs">所属渠道商编号：</div><span>{{detailMsg.channel_id}}</span></div>
          </div>        
      </el-dialog>
       
      <!-- 下面是添加模态框 -->
      <el-dialog :visible.sync="dialogTableVisible1"    width="680px" >
          <div class="diaTilte d1"><div class="titleMotai">账户信息</div>
              <div class="item"><div class="abs abs1">担保账户名称：</div> <span class="addSpan">
                 <el-input  size="small"  style="width:46.17%; height:40px;" v-model="msg.storeName" placeholder="请输入账户名称"></el-input>
              </span></div>
              <div class="item"><div class="abs abs1">有效日期：</div><span class="addSpan">
                  <el-date-picker v-model="msg.date" type="daterange" value-format="yyyy-MM-dd" size='small' style="width:46%; height:30px;"  range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
              </span></div>
              <div class="item"><div class="abs abs1">充值金额：</div><span class="addSpan">
                 <el-input  size="small"  style="width:46.17%; height:40px;" v-model="msg.rechargeMoney" placeholder="请输入充值金额"></el-input>
              </span></div>
              <div class="item"><div class="abs abs1">赠送金额：</div><span class="addSpan">
                  <el-input  size="small"  style="width:46.17%; height:40px;" v-model="msg.giveMoney" placeholder="请输入赠送金额"></el-input>
              </span></div>
              <div class="item"><div class="abs abs1">消费扣款比例：</div><span class="addSpan">
                <!-- <el-input  size="small"  style="width:46.17%; height:40px;" v-model="msg.rate" placeholder="请输入扣款比例"></el-input> -->
                 {{rate}}
                </span>
              </div>
              <div class="item">
                  <div class="abs abs1">违约赔付比例：</div>
                  <span class="addSpan">
                   35% <!-- <el-input  size="small"  style="width:8.8%; height:40px;" v-model="msg.rates" placeholder=""></el-input> &nbsp;％<i class="ratess">违约赔付比例在21％～41％之间</i> -->
              </span></div>
              <!-- <div class="item"><div class="abs abs1">优惠是否自动翻倍：</div><span class="addSpan">
                    <el-radio v-model="msg.fanbei" label="1">是</el-radio>
                    <el-radio v-model="msg.fanbei" label="2">否</el-radio>
              </span></div>
              <div class="item"><div class="abs abs1">到期是否自动下架：</div><span class="addSpan">
                    <el-radio v-model="msg.xiajia" label="1">是</el-radio>
                    <el-radio v-model="msg.xiajia" label="2">否</el-radio>
              </span></div> -->
               <div class="item"><div class="abs abs1">商家类型：</div><span class="addSpan">
                 <select v-model="msg.storeType" class="selectBox"  @click="ss()" >
                      <option v-for="(a,index) in options" :key="index" :value="a.value"  :disabled="a.disabled">{{ a.label }}</option>
                    </select>  
                 <!-- <el-input  size="small"  style="width:46.17%; height:40px;" v-model="msg.storeType" placeholder="请输入商家类型"></el-input> -->
              </span></div>
              <div class="item"><div class="abs abs1">商家名称：</div><span class="addSpan">
                  <el-input  size="small"  style="width:46.17%; height:40px;" v-model="msg.storeNames" placeholder="请输入商家名称"></el-input>
              </span></div>
              <div class="item"><div class="abs abs1">适用门店：</div><span class="addSpan cheeked">
                      <el-checkbox-group v-model="msg.checkList">
                        <el-checkbox class="firstChild" label="科华北路店"></el-checkbox>
                        <el-checkbox label="科华北路店B"></el-checkbox>
                        <el-checkbox label="科华北路店C"></el-checkbox>
                        <el-checkbox label="科华北路店a"></el-checkbox>
                        <el-checkbox label="科华北路店 B"></el-checkbox>
                        <el-checkbox label="科华北路店 C"></el-checkbox>
                    </el-checkbox-group>
              </span></div>
                <!-- 下面是按钮 -->
                 <div class="btnBox">
                     <el-button class="btnsubs"   @click="submitAdd">确认添加</el-button>
                     <el-button class="quXiao"  @click="quxiao">取消</el-button>                       
                 </div>  
          </div>             
      </el-dialog>
       <!-- 添加模态框结束 -->

   </div>
</template>

<script>
import Search from "./search.vue";
// import Details from "./Details.vue";
import waves from "@/directive/waves"; // 水波纹指令
import {
  merchantMsg,
  merchantDetail,
  merchantChange,
  merchantPutaway,
  merchantSoldOut,
  merchantStop,
  merchantAdd,
  accountSearch,
  merchantDownload,
  merchantChangeSubmit
} from "@/api/vi";
export default {
  name: "Table",
  directives: {
    waves
  },
  data() {
    return {
      pages: {
        page: 1,
        size: 10
      },

      multipleSelection: [],
      value1: "",
      tableKey: 0,
      list: null,
      total: 1,
      listLoading: true,
      dialogTableVisible: false,
      dialogTableVisible1: false,
      dialogTableVisible2: false,
      msg: {
        storeName: "",
        date: "",
        rechargeMoney: "",
        giveMoney: "",
        rate: "",
        rates: "",
        storeType: "dis",
        storeNames: "",
        checkList: []
      },
      options: [
        {
          value: "dis",
          label: "请选择商家类型",
          disabled: ""
        },
        {
          value: "连锁总商户",
          label: "连锁总商户"
        },
        {
          value: "连锁子商户",
          label: "连锁子商户"
        }
      ],
      detailMsg: {},
      changeMsg: {},
      gridDatas: []
    };
  },
  components: {
    Search
  },
  computed: {
    rate: function() {
      var sum = this.msg.rechargeMoney * 1 + this.msg.giveMoney * 1;
      var money = 0;
      if (!sum && !this.msg.rechargeMoney) {
        sum = 1;
      } else {
        money = this.msg.rechargeMoney;
      }
      var aa = (money / sum).toFixed(2);
      this.msg.rate = aa;
      return aa;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 搜索按钮传值回来
    channelSearch(data) {
      console.log(data);
      this.pages.page = 1;
      this.pages.size = 10;
      var datas = {
        merchant_name: data.storeName,
        merchantid: data.storeNums,
        prepaid: data.danbao,
        channelid: data.channelsNum,
        channel_name: data.channels,
        begin_time: data.date[0],
        end_time: data.date[1]
      };
      console.log(datas);
      this.getList(datas);
    },
    // 提示框函数
    message(msg, status) {
      var types = "";
      if (status == "200") {
        types = "success";
      } else {
        types = "error";
      }
      this.$message({
        message: msg,
        type: types
      });
    },
    // 获取商户交易基本列表信息
    getList(data) {
      this.listLoading = true;
      var basicURL =
        "/backend/api/v1/prepaid/merchantprepa/?page=" +
        this.pages.page +
        "&size=" +
        this.pages.size;

      merchantMsg(basicURL, data).then(res => {
        console.log("商户交易表格基本信息");
        console.log(res);
        var dataList = res.data.data.ret;
        console.log(dataList);
        for (var i = 0; i < dataList.length; i++) {
          dataList[i].create_at = dataList[i].create_at.split("T").join(" ");
        }
        this.total = res.data.data.count;
        this.gridDatas = dataList;
        // console.log(this.gridDatas);
      });
      setTimeout(() => {
        this.listLoading = false;
      }, 1.5 * 1000);
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    // 详情按钮
    passsubmit(data) {
      console.log("你点击了详情按钮");
      this.dialogTableVisible = true;
      console.log(data);
      var detailURL = "/backend/api/v1/prepaid/merchantprepaid/";
      merchantDetail(detailURL, data.guarantee_number).then(res => {
        console.log(res);
        this.detailMsg = res.data;
        this.detailMsg.create_at = data.create_at;
      });
    },
    // 修改按钮
    returnsubmit(data) {
      console.log("修改功能暂时不提供");
      this.dialogTableVisible2 = true;
      // merchantChange(data.danbaoNum).then(res => {
      //   console.log(res);
      // this.msg=data
      // });
      console.log(data);
    },
    // 批量的数据处理
    dataDeal() {
      var dataList = [];
      this.multipleSelection.forEach(function(v) {
        dataList.push(v.prepaid_card_id);
      });
      dataList.push(0);
      var datas = { ids: dataList.join(",") };
      return datas;
    },
    // 批量上架按钮
    jihuoJump() {
      console.log("批量上架");
      console.log(this.dataDeal());
      var PutawayURL = "/backend/api/v1/prepaid/cardshelf/";
      merchantPutaway(PutawayURL, this.dataDeal()).then(res => {
        console.log(res);
        this.message(res.data.msg, res.data.code);
      });
    },
    // 批量下架按钮
    passJump() {
      console.log("批量下架");
      var SoldOutURL = "/backend/api/v1/prepaid/cardobtained/";
      merchantSoldOut(SoldOutURL, this.dataDeal()).then(res => {
        console.log(res);
        this.message(res.data.msg, res.data.code);
      });
    },
    // 暂停服务按钮
    stopServes() {
      console.log("暂停服务");
      var StopURL = "/backend/api/v1/prepaid/cardout/";
      merchantStop(StopURL, this.dataDeal()).then(res => {
        console.log(res);
        this.message(res.data.msg, res.data.code);
      });
    },
    // 添加按钮
    AddJump() {
      console.log("你点击了添加按钮");
      this.dialogTableVisible1 = true;
    },
    // 导出按钮
    daochuJump() {
      console.log("导出按钮");
      var DownloadURL = "/backend/api/v1/prepaid/prepaidtoexcel/";
      merchantDownload(DownloadURL, this.dataDeal()).then(res => {
        console.log(res);
        let url = window.URL.createObjectURL(new Blob([res.data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "商户交易.xls");
        document.body.appendChild(link);
        link.click();
      });
    },

    //分页功能选择
    handleSizeChange(val) {
      console.log("选择个数");
      this.pages.page = 1;
      this.pages.size = val;
      this.getList();
    },
    //分页功能选择
    handleCurrentChange(val) {
      console.log("选择分页");
      this.pages.page = val;
      this.getList();
    },

    // 下面是添加模态框的方法
    submitAdd() {
      alert("添加成功");
      console.log(this.msg);
      var AddURL = "/backend/api/v1/prepaid/creprepa/";
      merchantAdd(AddURL, this.msg).then(res => {
        console.log(res);
      });
    },
    // 取消按钮
    quxiao() {
      this.dialogTableVisible1 = false;
      this.dialogTableVisible2 = false;
    },
    //修改模态框提交
    submitChange() {
      alert("修改成功");
      // merchantChangeSubmit(this.msg).then(res => {
      //   console.log(res);
      // });
    },
    ss() {
      this.options[0].disabled = "disabled";
      // this.options1[0].disabled = "disabled";
      // this.options2[0].disabled = "disabled";
    }
  }
};
</script>

<style scoped>
.userSearch {
  font-size: 14px;
  color: #666666;
  margin-left: 4.4%;
}
.searchHandle {
  margin-left: 30px;
  margin-top: 5px;
}

.xiaz {
  color: #1c3672;
}
.shanchu {
  color: #f6a623;
}
.bigBoxs {
  width: 96.47%;
  margin-left: 1%;
  background-color: #fff;
  padding-bottom: 20px;
  display: inline-block;
}
.tableBox {
  margin-bottom: 10px;
}
.el-table-column {
  /* height: 43px; */
}
.pagination-container {
  margin: 22px 0 60px 30%;
}
.allChose {
  width: 100%;
  min-height: 34px;

  text-align: right;
}
.searchs {
  width: 110px;
  font-size: 14px;
  text-align: center;
  margin-right: 1%;
  padding-left: 0;
  padding-right: 0;
}
.ppss {
  color: #4990e2;
  font-size: 14px;
}
.noppss {
  color: #999999;
  font-size: 14px;
}
.stopServer {
  font-size: 14px;
  color: #d0011b;
}
.rightMenu {
  width: 96%;
  padding-bottom: 50px;
  background-color: #fff;
  display: inline-block;
  margin-bottom: 40px;
}
.moneyStyles {
  font-size: 14px;
  color: #1c3672;
}
/* 下面是模态框的样式*/
.el-dialog,
.sssss {
  margin: 0 auto 20px;
}
.diaTilte {
  position: relative;
  text-align: center;
  line-height: 36px;
  font-size: 16px;
  color: #1c3672;
  width: 498px;
  margin-bottom: 20px;
  left: -4%;
  top: -60px;
}
.d1 {
  width: 678px;
  left: -2.94%;
}
.titleMotai {
  background: #f0f0f0;
}
.item {
  position: relative;
  padding: 1px 0 20px 0;
  /* background-color: aqua; */
  height: 20px;
  text-align: left;
  margin-top: 20px;
}
.item span {
  font-size: 14px;
  color: #333333;
  margin-left: 44.2%;
}
.item .addSpan {
  margin-left: 36.176%;
}
.abs {
  position: absolute;
  right: 55.8%;
  font-size: 14px;
  color: #999999;
}
.abs1 {
  right: 63.82%;
  color: #666666;
}

.item .shangjia {
  color: #4990e2;
}
.ratess {
  font-size: 12px;
  color: #1c3672;
  margin: 20px;
}
.cheeked {
  display: inline-block;
  width: 46.17%;
}
.firstChild {
  margin-left: 33px;
}
.btnBox {
  position: relative;
  top: 100px;
  width: 100%;
  height: 40px;
  margin: 30px auto 30px;
}
.btnsubs {
  width: 240px;
  height: 40px;
  background-image: linear-gradient(-180deg, #ebf1fc 0%, #d1ddf6 100%);
  border-radius: 4px;
  font-size: 14px;
  color: #1c3672;
}
.quXiao {
  width: 240px;
  height: 40px;
  border: 1px solid #1c3672;
  border-radius: 4px;
  font-size: 14px;
  color: #1c3672;
}
.selectBox {
  width: 46.17%;
  height: 35px;
  border: 1px solid #dcdfe6;
}
</style>