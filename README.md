# Rename-Nickname

基于oicq实现的批量修改QQ群昵称的工具

## 用法

首先保证你已经安装了`Node.js`。

运行`npm install`安装依赖。

在src目录下创建配置文件`config.json`, 格式如下:

```json
{
  "number": 12345678901,
  "match": "猛男",
  "replace": "萌妹子"
}
```

其中`match`参数支持正则表达式，且匹配规则为全局匹配(`flags: g`)。

运行`npm run build && npm run start`启动程序，或者运行`npm run dev`在开发模式下启动程序。

## 使用场合

*你觉得会是什么呢？ww*

## 许可协议

本项目基于GNU GPL 2.0许可协议发布。
