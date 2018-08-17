/**
 * Created by shidanlifuhetian on 2017/3/6.
 */
// useful functions
function add0(m){return m<10?'0'+m:m }

function formatTimeStamp(timeStamp) {
    var time = new Date(timeStamp*1000);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+'-'+add0(h)+'-'+add0(mm)+'-'+add0(s);
}
function formatTimeStamp2(timeStamp) {
    var time = new Date(timeStamp*1000);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

// 获取目录路径,返回值包括斜线形如："/abc/bsd/to/"
function getFolderPath(sqliteFilePath) {
    console.log(sqliteFilePath);
    var sep = sqliteFilePath.split("/");
    sep.pop();
    sep.pop();
    var folderPath = sep.join("/");
    return folderPath+="/";
}
function getMyMd5(folderPath) {
    var sep = folderPath.split("/");
    sep.pop();
    return sep.pop();
}
function getChatterMd5(tableName) {
    var sep = tableName.split("_");
    return sep.pop();

}
function imageToBase64(imgFile) {
    var fs = require('fs');
    var path = require('path');
    var data = fs.readFileSync(imgFile);
    var imgTag = "<img>";
    if(data != undefined) {
        var a = data.toString("base64");
        imgTag = "<img src='data:image/jpeg;base64," + a + "'/>";
    }
    return imgTag;
}
var hex_to_utf8 = function (hex_string) {
    // a string like "e7be8ee7be8ee7be8ee985b1f09f9088"
    var chars=[]
    for (var i=0; i<hex_string.length; i+=2){
        var cur_hex = hex_string.substr(i,2)
        var cur_dec = parseInt(cur_hex,16)
        var cur_char = String.fromCharCode(cur_dec)
        chars.push(cur_char)
    }
    //convert to unicode first
    let utf8 = require('utf8')
    return utf8.decode(chars.join(''))
};