<template>
  <div >
    <!--首页的Ip显示区域 -->
    <template v-if="device!=='mobile'">      
   <el-row :gutter="10" class="panel-groups"  >
     <el-col :xs="8" :sm="8" :md="8" :lg="5" :xl="3" class="card-panel-cols">
         <div class="grid-contents">上次登录IP：{{login_last_info.logins_ip}}</div>
      </el-col>
     <el-col :xs="6" :sm="6" :md="5" :lg="3" :xl="3" class="card-panel-cols">
        <div class="grid-content ">登录地址：{{login_last_info.logins_adress}}</div>
      </el-col>
    <el-col :xs="6" :sm="6" :md="7" :lg="7" :xl="4" class="card-panel-cols">
      <div class="grid-content">登录时间：{{login_last_info.logins_time}}</div>
    </el-col>
    <el-col :xs="1" :sm="1" :md="1" :lg="7" :xl="12" class="card-panel-cols">
      <div class="sss"></div>
    </el-col>
    <el-col :xs="3" :sm="3" :md="3" :lg="2" :xl="2" class="card-panel-cols">
      <div class="grid-content lastc " @click="actBlog">
        <svg-icon icon-class="edit" class="icoms" />
       <span>操作日志</span>
      </div>
    </el-col>
  </el-row>
 </template>
  <!--数据显示区  -->
      <panel-group :panelGroup='panelGroup' />
 <div v-if="roles=='admin'||roles=='bankadmin'" >  
      <!-- 用户总览 -->
   <UserOverview  :UserOverview="UserOverview"/>
   <!-- eachar图表 -->
   </div>
    <el-row class="echarBox">
      <div class="echarTitle" >交易统计</div>
      <div class="showData"> 
                  <div class="tardNum" v-if="isSlectd=='1'">本周交易笔数：<span>{{showTard.num}}</span></div>
                  <div class="tardDetails"  v-if="isSlectd=='1'">本周交易总额：<span>{{showTard.amount__sum | toThousandFilter}}</span></div>
                  <div class="tardNum" v-if="isSlectd=='2'">本月交易笔数：<span>{{showTard.num}}</span></div>
                  <div class="tardDetails"  v-if="isSlectd=='2'">本月交易总额：<span>{{showTard.amount__sum | toThousandFilter}}</span></div>
         <div class="rightMenus">
         <div class="tardChooseed  " :class="isSlectd=='1'?'selected':''" @click="slected(1)">本周</div>
         <div class="choose2" :class="isSlectd=='2'?'selected':''" @click="slected(2)">本月</div>
         <!-- 日期选择 -->
        <div class="block" id="datess">
          <el-date-picker
            v-model="value6"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change='submitDate'
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
      </div>
     </div>
      </div>
      <line-chart :chart-data="lineChartData"/> 
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { allMsgList, dateSearch } from "@/api/home";
import PanelGroup from "./components/PanelGroup";
import UserOverview from "./components/UserOverview";
import LineChart from "./components/LineChart";
import CountTo from "vue-count-to";

export default {
  name: "DashboardAdmin",
  components: { PanelGroup, UserOverview, LineChart, CountTo },
  data() {
    return {
      lineChartDatas: {
        xDatas: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        expectedData: [],
        actualData: []
      },
      lineChartData: {},
      value6: "",
      isSlectd: 1,
      login_last_info: {
        logins_ip: "192.168.2.112",
        logins_adress: "四川成都",
        logins_time: "2018-10-22 11:40:02.268"
      },
      panelGroup: {
        today_count: 0,
        today_sum: 0,
        count_tomonth: 0,
        sum_tomonth: 0
      },
      UserOverview: {
        passed_channel: 0,
        passed_merchant: 0,
        users_count: 0,
        Pending_channel: 0,
        Pending_merchant: 0
      },
      toWeek: {
        toweeks_count: 0,
        toweeks_sum: 0
      },
      showTard: {
        num: "0",
        amount__sum: "0"
      }
    };
  },
  computed: {
    ...mapGetters(["roles", "device"])
  },

  mounted() {
    // this.getMsg();
    // this.slected();
  },
  created() {
    this.getMsg();
    // this.slected(1);
  },
  methods: {
    // 获取主页面基本信息
    getMsg() {
      this.lineChartData = this.lineChartDatas;
      allMsgList().then(res => {
        console.log(res.data);
        var data = res.data;
        this.login_last_info.logins_ip = res.data.logins_ip;
        // 转换时间
        var times = res.data.logins_time;
        times = times.split("T").join(" ");
        this.login_last_info.logins_adress = res.data.logins_adress;
        this.login_last_info.logins_time = times;
        // 将panelGroup中的数据取出来
        this.panelGroup.today_count = data.today_count;
        this.panelGroup.today_sum = data.today_sum.amount__sum;
        this.panelGroup.count_tomonth = data.count_tomonth;
        this.panelGroup.sum_tomonth = data.sum_tomonth.amount__sum;
        // 将UserOverview中的数据取出来
        this.UserOverview.Pending_channel = data.Pending_channel;
        this.UserOverview.Pending_merchant = data.Pending_merchant;
        this.UserOverview.passed_channel = data.passed_channel;
        this.UserOverview.passed_merchant = data.passed_merchant;
        this.UserOverview.users_count = data.users_count;
        // 将本周的数据取出来
        this.toWeek.toweeks_count = data.toweeks_count;
        this.toWeek.toweeks_sum = data.toweeks_sum.amount__sum;
        this.slected(1);
      });
    },

    // 选择本月或者本周的数据
    slected(index) {
      this.isSlectd = index;
      if (!index || index == "1") {
        this.isSlectd = 1;
        console.log("默认本周数据");
        this.showTard.num = this.toWeek.toweeks_count;
        this.showTard.amount__sum = this.toWeek.toweeks_sum;
        console.log(this.showTard);
        var data = {};
        var data = { begin_time: "", end_time: "" };
        var dateUrl = "/backend/api/v1/inhome/daysrange/";
        dateSearch(dateUrl, data).then(res => {
          console.log(res);
          const dataLsit = res.data.sum_list;

          this.lineChartDatas.expectedData = dataLsit.map(function(item) {
            return item[1];
          });
          this.lineChartDatas.actualData = dataLsit.map(function(item) {
            return item[2];
          });
          this.lineChartData = this.lineChartDatas;
        });
      } else if (index == "2") {
        console.log("你选择了本月数据");
        this.showTard.num = this.panelGroup.count_tomonth;
        this.showTard.amount__sum = this.panelGroup.sum_tomonth;

        // console.log(this.getNowFormatDate());
        // console.log(this.getMonthStartDate());
        if (this.getMonthStartDate() && this.getNowFormatDate()) {
          var val = [];
          val.push(this.getMonthStartDate());
          val.push(this.getNowFormatDate());
          // console.log(val);
          this.submitDate(val);
        }
      }
    },
    //格式化日期：yyyy-MM-dd
    formatDate(date) {
      var myyear = date.getFullYear();
      var mymonth = date.getMonth() + 1;
      var myweekday = date.getDate();

      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
        myweekday = "0" + myweekday;
      }
      return myyear + "-" + mymonth + "-" + myweekday;
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    //获得本月的开始日期
    getMonthStartDate() {
      var now = new Date(); //当前日期
      var nowMonth = now.getMonth(); //当前月
      var nowYear = now.getYear(); //当前年
      nowYear += nowYear < 2000 ? 1900 : 0; //
      var monthStartDate = new Date(nowYear, nowMonth, 1);
      return this.formatDate(monthStartDate);
    },

    //选择时间进行查询
    submitDate(val) {
      var that = this;
      console.log(val);
      var data = { begin_time: val[0], end_time: val[1] };
      console.log(data);
      // 查询数据
      var dateUrl = "/backend/api/v1/inhome/daysrange/";
      dateSearch(dateUrl, data).then(res => {
        console.log(res.data.sum_list);
        const dataLsit = res.data.sum_list;
        // 获取相应的数据
        var lineChartData = {};
        lineChartData.xDatas = dataLsit.map(function(item) {
          return item[0];
        });
        lineChartData.expectedData = dataLsit.map(function(item) {
          return item[1];
        });
        lineChartData.actualData = dataLsit.map(function(item) {
          return item[2];
        });
        that.lineChartData = lineChartData;
        console.log(that.lineChartData);
        // this.detailMsg = res.data;
      });
    },
    // 查看操作日志
    actBlog() {
      console.log("查看操作日志");

      this.$store.dispatch("componentsId", "operationblog");
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.panel-groups {
  margin-top: 20px;
  height: 17px;
  .card-panel-cols {
    margin-bottom: 21px;
    height: 17px;
    line-height: 17px;
    font-size: 12px;
    color: #666666;
    overflow: hidden;
  }
  .grid-contents {
    padding-left: 20px;
  }
  .icoms {
    font-size: 14px;
    float: left;
  }
  .lastc {
    cursor: pointer;
    span {
      margin-left: 10px;
    }
  }
}
.echarBox {
  height: 444px;
  background: #fff;
  width: 97.5%;
  // padding: 16px 20px 0 20px;
  margin: 32px auto;
  .echarTitle {
    font-size: 18px;
    color: #1c3672;
    margin-top: 10px;
    text-align: center;
    font-weight: 600;
  }
  .showData {
    font-size: 16px;
    color: #666666;
    margin-top: 20px;
    div {
      display: inline-block;
    }
    .tardNum {
      margin-left: 1%;
      span {
        color: #1c3672;
      }
    }
    .tardDetails {
      margin-left: 2.1%;
      span {
        color: #1c3672;
      }
    }
    .rightMenus {
      position: absolute;
      right: 0;
      z-index: 200;
      height: 30px;
      overflow: hidden;
    }
    #datess {
      width: 65%;
      margin-left: 2%;
      background-color: #628bdd;
      .el-input__inner {
        width: 100%;
        padding: 0;
        border: none;
        border-radius: 0%;
        line-height: 50%;
        box-sizing: border-box;
        .el-date-editor .el-range-input {
          width: 37%;
        }
      }
    }
    .tardChooseed {
      color: #999999;
    }
    .choose2 {
      margin-left: 1.6%;
      color: #999999;
    }
    .selected {
      color: #1c3672;
    }
  }
}
</style>

