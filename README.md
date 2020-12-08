# 介绍

**一个用于实时显示csgo服务器内信息的网站框架插件(无数据库)**

对于每一个csgo服务器，都可以配置一个这样的插件通过浏览器访问`http://服务器ip:端口`来查看服务器内的信息。

## 功能

- [x] 服务器内玩家信息(名称，steamid，位置)显示

- [x] 道具效果的显示

- [x] 网页和游戏服务器之间的双向通讯：

  1. 游戏服务器内的聊天消息会显示到网页上；

  2. 网页提供文字窗口用于发消息，其他浏览器与游戏服务器内都可以收到消息

  聊天信息实时显示，不记录历史消息。
  
- [ ] 道具轨迹显示

- [ ] 丰富的配置选项

- [ ] 玩家在线时间显示

- [ ] 精致的界面:(

# 安装-更新-卸载 (测试)

## 安装

> **注意**
>
> 我只针对`Ubuntu18`的游戏服务器进行过测试，其他`linux`系的服务器也应该可以，只不过下面步骤中的一些指令需要对应更改。

1. 安装`git`、`pip3`和`screen`

   ```bash
   sudo apt -y update && sudo apt -y upgrade # 更新包管理工具
   
   sudo apt install git && sudo apt install python3-pip && sudo apt install screen # 安装git pip3 screen
   ```

2. 获取项目文件夹

   > 示例安装在了`<CSGO目录>/addons/sourcemod/`文件夹下
   >
   > 如果你不了解此项目工作原理的话建议与示例中的文件目录保持一致

   ```shell
   cd <CSGO目录>/addons/sourcemod    # 进入sourcemod文件夹
   
   git clone --depth=1 https://github.com/hx-w/CSGO-RealTimeMap.git # 克隆仓库
   
   cd CSGO-RealTimeMap/ # 进入项目库
   ```

3. 安装环境依赖

   ```shell
   sudo pip3 install -r requirements.txt  # 安装python3库
   
   cp -r ./sourcemod/* ../    # 安装smx插件与system2依赖
   ```

4. 创建任务会话并挂起

   ```shell
   screen -R rtm   # 创建一个名为rtm的会话
   
   python3 server.py  # 启动网站服务器
   
   按住Ctrl+AD 挂起会话
   ```

5. 开启`5000` tcp端口，前往服务商管理面板开启tcp的`5000`端口

现在就可以去浏览器查看`https://服务器ip:5000`查看页面是否正常显示。

正常情况下会显示一张地图，地图下方会有一个文本框用于发送消息。

如果安装正常，那么进入游戏服务器里网页上也能正常显示。

## 更新

由于项目功能还未完善，不定期会有更新，更新方法如下：

```shell
cd <CSGO目录>/addons/sourcemod/CSGO-RealTimeMap/   # 进入项目文件夹

git pull # 拉取最新更新

cp -r ./sourcemod/* ../    # 更新smx插件与system2依赖

screen -R rtm # 进入rtm会话

按住Ctrl+C 退出python3程序

python3 server.py  # 重启网站服务器

按住Ctrl+AD 挂起会话
```

## 卸载

```shell
cd <CSGO目录>/addons/sourcemod/  # 进入sourcemod文件夹

screen -S rtm -X quit  # 关闭rtm会话

mv ./plugins/RealTimeMap.smx ./plugins/disabled/  # 禁用smx插件

rm -rf ./CSGO-RealTimeMap/  # 删除项目文件夹
```

**如果出现了问题请及时联系我：发issue或进QQ群762993431反馈**