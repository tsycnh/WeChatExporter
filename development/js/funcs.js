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
    if (hex_string.length == 0){
        return ""
    }

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
var decode_user_name_info = function (hex_string) {
    if (hex_string.substr(0,2)=="x'"){
        hex_string = hex_string.substring(2,hex_string.length-2)
    }

    let marks =['0a','12','1a','22','2a','32','3a','42']

    var i = 0
    var mark_i = 0
    var all_data =[]
    while( i < hex_string.length){
        var current_mark = hex_string.substr(i,2)
        if (current_mark == marks[mark_i]){
            var data_length = hex_string.substr(i+2,2)
            var data_length = parseInt(data_length,16)*2;//hex to dec
            var hex_data = hex_string.substr(i+4,data_length)
            var utf8_data = hex_to_utf8(hex_data)
            i += 4+data_length
            mark_i += 1
            all_data.push(utf8_data)
        }else{
            console.log('出错：mark不符！')
        }
    }
    // console.log(all_data)
    return {
        "nickname":all_data[0],
        "wechatID":all_data[1],
        "remark":all_data[2]
    }
}

r = decode_user_name_info("0a0f576520617265206861636b6572732112001a0022002a00320c57656172656861636b6572733a004200")
console.log(r)
//decode_user_name_info('0a10e7be8ee7be8ee7be8ee985b1f09f9088120f7a68616f7975616e6d6569313031361a22e383bd28e280a2cc80cf89e280a2cc812029e3829de7be8ee7be8ee59392f09f9290220d3f3f3f3f6d65696d656964613f2a083f3f3f3f4d4d443f320f6d65696d65696d65696a69616e673f3a004200')