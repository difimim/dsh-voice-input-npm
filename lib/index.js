// dsh-voice-input · Node 半（host 插件）。
// 纯客户端 UI 插件：host 侧无行为，空 apply 只为了让本包出现在组合里
// （浏览器半通过 exports["./client"] 与 package.json 的 dsh.client 声明被发现）。
function apply() {}
export { apply };
