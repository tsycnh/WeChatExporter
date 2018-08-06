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

使用第三方软件导出微信备份数据，这里使用的是iMazing

![image](https://github.com/tsycnh/WeChatExporter/blob/master/imgs/for%20readme/backup2.png)

Step2:安装nodejs（6.9.1版本）

Step3:安装nwjs（0.19.3版本） 官网：https://nwjs.io

### 二、运行软件

Step1:下载项目 `git clone https://github.com/tsycnh/WeChatExporter`

Step2: `cd path/to/WeChatExporter`

Step3: `cd development`

Step4: `npm install`

Step5: copy `framework/node-webkit-v0.19.3-darwin-x64` to `node_modules/.3.1.8@sqlite3/lib/binding`

Step6: `/path/to/nw/nwjs.app/Contents/MacOS/nwjs .`

即可运行导出工具。
### 三、使用软件
目前工具由三部分组成：

soft1: 用来查看并确定要导出的聊天对象

soft2：用来导出并转换数据

soft3：直接查看聊天内容

--------------

Step1: 点击soft1进入分析模式，输入导出的Documents文件夹路径，然进入分析模式

Step2: 左上角显示的是在当前手机上登陆过的微信帐号，点击任意一个将在左下角显示和你聊过天的朋友，默认只显示聊天消息总数超过100的朋友（或群聊）。

Step3:点击左下角任意一聊天对象，会在右侧显示10条最近的聊天记录，以做确认之用。

Step4:这时右上角会显示两串红色的字符，分别是你的微信账户和聊天对象（均经过MD5加密）。将这两个数值复制下来。

![image](https://github.com/tsycnh/WeChatExporter/blob/master/imgs/for%20readme/soft1.png)

Step5:点击左上角微信备份按钮跳转到主页，点击Soft2 进入解析多媒体模式。

Step6:按要求填写表单，日期区间可以控制导出聊天记录的时间范围，默认不填表示全部导出。然后点击开始生成数据。生成结束后会得到一个文件夹，即`path/to/output` 里面存放了所有需要的信息。至此Documents目录已经没有用了，可以删除。

![image](https://github.com/tsycnh/WeChatExporter/blob/master/imgs/for%20readme/soft2.png)

Step7:回到主页进入Soft3 页面，输入刚到导出的output目录，即可开始查看导出的聊天记录了。

之后再查看直接进入Soft3页面即可。

![image](https://github.com/tsycnh/WeChatExporter/blob/master/imgs/for%20readme/soft3.png)

PS:目前有些流程还是有些累赘和繁琐，有待改进
欢迎PR

---
#### 待添加功能

* soft1和soft2合并
* 为微信用户添加头像
* 为微信用户添加昵称
* 导出html功能
* 聊天查看页面增加图像点击放大


-----
TODO:

1. mmsetting.archive 直接改扩展名为plist就可以获取内部内容。即可以获取当我们微信用户的昵称。需要找一个可以处理plist的库来处理。参考：
https://www.jianshu.com/p/07a8d87e698b

1. 上面那个参考里还提到了一个好友信息的数据库。回头可以搞一搞

2. 原soft4变成soft3。应去除导出html功能，单独放到新soft4内

3. soft1和soft2可以合并。

4. soft4可以直接将grunt那一套拿过来即可

-----
第三方库版本
nodejs 6.9.1
nwjs   0.19.3