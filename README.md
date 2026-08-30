# DSH Voice Input · DeepSeek Harness 语音输入插件

在 DeepSeek Harness（DSH）输入框底部加入一个麦克风按钮：点击后用浏览器内置的 **Web Speech API** 把语音**实时**转成文字并填入输入框。零成本、零服务端部署。

A DeepSeek Harness plugin that adds a microphone button to the composer. Click it to transcribe speech into the input box using the browser's built-in Web Speech API — zero cost, zero server.

---

## 安装

这是一个标准的 DSH 插件 bundle，用一条命令安装：

```bash
dsh plugin --profile web add @difimim/dsh-voice-input
```

装完**重启 DSH**（`dsh web`），按钮就会出现在输入框工具行左侧。

> 其他 profile（如 `tui`）同理：`dsh plugin --profile tui add @difimim/dsh-voice-input`。

### 从本地 / 未发布源码安装

还没发布到 npm 时，可以按路径安装：

```bash
dsh plugin --profile web add file:/path/to/dsh-voice-input
# 或
dsh plugin --profile web add link:/path/to/dsh-voice-input
```

## 功能特性

- 🎙️ 输入框工具行左侧新增麦克风按钮，点击开始 / 停止收音
- ⚡ 实时识别：边说边把中间结果写进输入框草稿
- ➕ 追加式写入：不清空已有文字，识别结果追加到当前草稿末尾
- 🌐 零成本零服务端：直接复用浏览器内置 Web Speech API
- 🎨 跟随主题：按钮颜色使用 DSH 主题变量，自动适配明暗色

## 使用

1. 点麦克风图标 → 按钮变红并出现脉冲动画，开始收音；
2. 直接说话，文字会**实时**出现在输入框里；
3. 再点一下（图标变方块）→ 停止收音；
4. 确认文字无误后，正常回车发送。

## 工作原理

| 部分 | 说明 |
| --- | --- |
| **识别引擎** | 浏览器内置 Web Speech API（`SpeechRecognition` / `webkitSpeechRecognition`） |
| **识别语言** | 默认 `zh-CN`（中文），可在 `lib/client.js` 里改 `rec.lang` |
| **写入方式** | 通过输入框 Slot 提供的 `inputActions.setDraft()` 写入草稿，与手打内容共存 |
| **按钮位置** | `conversation.input.left`（输入框工具行左侧，模型选择那一行） |

## 浏览器兼容性

| 浏览器 | 支持 |
| --- | --- |
| Chrome / Edge | ✅（推荐） |
| Safari | ✅（较新版本，行为略有差异） |
| Firefox | ❌（不支持 Web Speech API） |

- 首次点击会弹出**麦克风授权**，请点「允许」。
- 需联网：Web Speech API 会把音频交给浏览器厂商的识别服务器。

## 隐私说明

当前方案（Web Speech API）为了“零成本、零部署”，会把语音发到浏览器厂商的识别服务。若你在意隐私或需要完全离线，请参考下方 Roadmap 的 Vosk 接入计划。

## 目录结构

```
dsh-voice-input/
├── package.json      # dsh.client + dsh.bundle.patch 声明
├── cordis.patch.yml  # bundle patch：把本插件挂进 host 组合
├── lib/
│   ├── index.js      # Node 半（纯 UI 插件，空 apply）
│   └── client.js     # 浏览器半（麦克风按钮 + Web Speech 识别）
├── README.md
└── LICENSE
```

## Roadmap

- [x] Web Speech API 实时语音输入
- [ ] 语言切换（中文 / 英文 / 自动）
- [ ] Vosk 离线识别接入（通过 host 侧 Remote 服务）
- [ ] 语音输入过程中的可视化状态条

## License

[MIT](./LICENSE)
