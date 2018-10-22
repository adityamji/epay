import request from "@/utils/request";
// 数据统计中交易概况基本数据
export function dataMsg(query) {
  return request({
    url: "/article/list",
    method: "get",
    params: query
  });
}
//按日查询搜索
export function searchDay(data) {
  return request({
    url: "/article/update",
    method: "post",
    data
  });
}
// 表格的基本信息获取
export function tebleMsg(data) {
  return request({
    url: "/article/update",
    method: "post",
    data
  });
}
// 渠道搜索请求
export function searchDataMsg(data) {
  return request({
    url: "/article/update",
    method: "post",
    data
  });
}

// 渠道担保交易请求
export function channelMsgList(data) {
  return request({
    url: "/article/update",
    method: "post",
    data
  });
}
// 渠道担保交易导出
export function channelDownload(data) {
  return request({
    url: "/article/update",
    method: "post",
    data
  });
}