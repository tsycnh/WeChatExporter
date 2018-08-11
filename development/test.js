var fs = require('fs');
var plist = require('plist');


var parseMmsetting = function (mmsettingPath) {
    var command = "plutil -convert xml1 "+mmsettingPath;
    //console.log("command:",command);
    var stdOut = require('child_process').execSync( command,{// child_process会调用sh命令，pc会调用cmd.exe命令
        encoding: "utf8"
    } );

    var content = fs.readFileSync(mmsettingPath, 'utf8')
    var obj = plist.parse(content).$objects;
    var headUrl = ""
    for (var i=0;i<obj.length;i++){
        if (typeof obj[i] == "string"){
            var pos1 = obj[i].indexOf('http://wx.qlogo.cn/')
            if (pos1==0 & obj[i].slice(-3)=='132'){
                // console.log(obj[i])
                headUrl = obj[i]
            }
        }
    }
    var myInfo = {
        nickname:   obj[3], //昵称
        wechatid:   obj[19], //微信号
        headUrl:    headUrl, //头像1
    }
    return myInfo
}
i = parseMmsetting('/Users/shidanlifuhetian/Desktop/微信2017年01月07日备份/Documents/4ff9910cd14885aa373c45c4b7909ba7/mmsetting.archive')
console.log(i)