import request from "@/utils/request";
//的短信模块基本数据
export function smsMsg(query) {
  return request({
    url: "/article/list",
    method: "get",
    params: query
  });
}
//修改短信提交功能
export function smsSubmit(data) {
  return request({
    url: "/article/update",
    method: "post",
    data
  });
}
//删除短信提交功能
export function deleted(data) {
  return request({
    url: "/article/update",
    method: "post",
    data
  });
}
// 协议获取基本信息
export function AgreemenMsg() {
  return request({
    url: "/backend/api/v1/protocol/arg-list/",
    method: "get"
  });
}

// 具体协议信息
export function AgreemenDetail(id) {
  return request({
    url: "/backend/api/v1/protocol/arg-down/",
    method: "get",
    params: { id }
  });
}
// 下载协议
export function AgreemenDownload(id) {
  return request({
    url: "/backend/api/v1/protocol/arg-down/",
    method: "get",
    responseType: "blob",
    params: { id }
  });
}
// 编辑协议信息
export function EditDetail(URL, data) {
  return request({
    url: URL,
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    data
  });
}
