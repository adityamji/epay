import request from "@/utils/request";
// 信条交易搜索功能
export function tradeSearch(data) {
  return request({
    url: "incoming/channellist/",
    method: "post",
    data
  });
}

// 交易账户基本信息获取
export function merchantMsg(URL, data) {
  return request({
    url: URL,
    method: "POST",
    data
  });
}
//交易详情请求
export function merchantDetail(URL, id) {
  return request({
    url: URL,
    method: "get",
    params: { id }
  });
}
//导出请求
export function merchantDownload(URL, data) {
  return request({
    url: URL,
    method: "post",
    data
  });
}
//异常订单处理提交
export function abOrderSubmit(URL, data) {
  return request({
    url: URL,
    method: "post",
    data
  });
}
