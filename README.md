# WeChatExporter

微信聊天记录导出工具。无需越狱手机，即可导出备份微信聊天记录。目前支持文字、语音、图片、视频的查看。
项目基于nodejs实现，框架采用angularjs

目前支持导出iOS系统导出，软件运行仅限MacOS系统。（其实安卓和Windows系统也能用，只是现在懒得适配多平台）

使用方法：
### 一、准备工作
Step1:数据导出：
首先需要将微信聊天数据进行导出。目前只支持iOS系统，如果你用的是安卓机，可以尝试将聊天记录迁移到iPad上，再导出。

按照下图使用iTunes备份整机数据，注意**不要选择**给iPhone备份加密

![image](https://github.com/tsycnh/WeChatExporter/blob/master/imgs/for%20readme/backup1.png)

使用第三方软件导出微信备份数据，这里使用的是iMazing。导出Documents文件夹即可。

![image](https://github.com/tsycnh/WeChatExporter/blob/master/imgs/for%20readme/backup2.png)

Step2:安装nodejs（8.11.3版本） 下载地址：https://nodejs.org/dist/v8.11.3/node-v8.11.3-x64.msi

Step3:安装nwjs（0.32.1版本） 下载地址：https://dl.nwjs.io/v0.32.1/nwjs-v0.32.1-osx-x64.zip

### 二、运行软件

Step1:下载项目 `git clone https://github.com/tsycnh/WeChatExporter`

Step2: `cd path/to/WeChatExporter`

Step3: `cd development`

Step4: `npm install`

Step5: copy `framework/node-webkit-v0.32.1-darwin-x64` to `node_modules/sqlite3/lib/binding`

Step6: `/path/to/nw/nwjs.app/Contents/MacOS/nwjs .`

即可运行导出工具。
### 三、使用软件
目前工具由两部分组成：

1.解析并导出数据

2.直接查看聊天内容

--------------

Step1: 点击开始原始数据分析按钮，然进入分析模式

Step2: 左上角显示的是在当前手机上登陆过的微信帐号，点击任意一个将在左下角显示和你聊过天的朋友，默认只显示聊天消息总数超过100的朋友（或群聊）。

Step3:点击左下角任意一聊天对象，会在右侧显示10条最近的聊天记录，以做确认之用。

Step4:这时右上角会显示某某与某某的聊天记录红色字符，点击下一步。

![image](https://github.com/tsycnh/WeChatExporter/blob/master/imgs/for%20readme/soft1.png)

Step5:填写数据导出目录，日期区间可以控制导出聊天记录的时间范围，默认不填表示全部导出。然后点击开始生成数据。生成结束后会得到一个文件夹，即`path/to/output` 里面存放了所有需要的信息。至此Documents目录已经没有用了，可以删除。

![image](https://github.com/tsycnh/WeChatExporter/blob/master/imgs/for%20readme/soft2.png)

Step6:点击左上角为微信备份回到主页点击显示聊天记录，输入刚到导出的output目录，即可开始查看导出的聊天记录了。

之后再查看直接进入显示聊天记录页面即可。

![image](https://github.com/tsycnh/WeChatExporter/blob/master/imgs/for%20readme/soft3.png)

PS:目前有些流程还是有些累赘和繁琐，有待改进
欢迎PR

---
#### 待添加功能

* soft1和soft2合并 Done
* 为微信用户添加头像
* 为微信用户添加昵称
* 导出html功能
* 聊天查看页面增加图像点击放大


-----
TODO:

2. 原soft4变成soft3。应去除导出html功能，单独放到新soft4内

4. soft4可以直接将grunt那一套拿过来即可

-----
第三方库版本
nodejs 8.11.3
nwjs   0.32.1