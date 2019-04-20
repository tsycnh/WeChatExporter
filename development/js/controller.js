var WechatBackupControllers = angular.module('WechatBackupControllers',[]);

WechatBackupControllers.controller('TopBarController',["$scope","$rootScope",function ($scope,$rootScope) {}]);


WechatBackupControllers.controller('Soft1Controller',["$scope","$state",function ($scope,$state) {
    $scope.page = "entry page";
    $scope.dPath = "";
    $scope.myFriends = {};
    $scope.onFileChange = function (files) {
        console.log(files);
        $scope.sqlFile = files[0].path;
    };
    $scope.loadDocuments = function (documentsPath) {
        console.log(documentsPath);
        $state.go('chatList',{documentsPath:documentsPath});
    };
    $scope.Soft1Controller = function () {
        console.log("entry soft1 controller constructor");
    };
    $scope.Soft1Controller();
}]);
WechatBackupControllers.controller('Soft2Controller',["$scope","$state","$stateParams",function ($scope,$state,$stateParams) {
    console.log($stateParams);
    $scope.page = "entry page";
    $scope.dPath = $stateParams.documentsPath;
    $scope.meInfo = JSON.parse($stateParams.meInfo);
    $scope.otherInfo = JSON.parse($stateParams.otherInfo);
    // alert($scope.otherInfo);

    $scope.roomInfo = JSON.parse($stateParams.roomInfo)
    $scope.otherWechatID = $stateParams.otherWechatID;
    $scope.wechatUserMD5 = $scope.meInfo['md5'];
    $scope.chatTableName = $scope.roomInfo['tableName'];
    // $scope.outputLimit = 100;
    $scope.startDate = "";
    $scope.endDate = "";
    $scope.startTimeStamp = -1;
    $scope.endTimeStamp = -1;
    $scope.documentsPath = {
        rootFolder:"",
        audioFolder:"",
        imageFolder:"",
        videoFolder:""
    };
    $scope.targetPath={
        rootFolder:"",
        tmpFolder:"",
        resourceFolder:"",
        audioFolder:"",
        imageFolder:"",
        imageThumbnailFolder:"",
        videoFolder:"",
        videoThumbnailFolder:""
    };
    $scope.info = "";

    $scope.onFileChange = function (files) {
        console.log(files);
        $scope.sqlFile = files[0].path;
    };
    $scope.processText = function () {
        return {
            resourceName:"",
            thumbnailName:"",
            convertStatus:true,
            errorMessage:""
        }
    };
    $scope.processAudio = function (localID,createTime) {
        //1. 根据localID定位到备份文件夹里的aud文件
        //console.log(">>enter processAudio");
        var fs = require('fs');
        var fse = require('fs-extra');
        var path = require('path');
        var result={
            resourceName:"",
            thumbnailName:"",
            convertStatus:true,
            errorMessage:""
        };
        //var data = fs.readFileSync($scope.audioFolderPath+"/"+row.MesLocalID+".mp3");
        //2. 调用子进程来转换为MP3文件,并拷贝到新文件夹下
        //3. 返回新MP3的相对url地址
        var command = "sh "+$scope.documentsPath.audioFolder + "/converter.sh "+localID + ".aud mp3";//!!! 注意，此处的 sh 不能少。官方虽说此处会自动调用sh，但是在release版下是行不通的，切记！
        //console.log("command:",command);
        var stdOut = require('child_process').execSync( command,{// child_process会调用sh命令，pc会调用cmd.exe命令
            encoding: "utf8"
        } );
        //console.log(stdOut);
        if(stdOut.indexOf("[OK]") > 0)// 存在OK,即转换成功
        {
            var audioFileOld = $scope.documentsPath.audioFolder+"/"+localID+".mp3";
            var audioFileNew = path.join($scope.targetPath.audioFolder,formatTimeStamp(createTime)+".mp3");
            fse.copySync(audioFileOld,audioFileNew);
            //拷贝至新地址
            //audioTag = "<audio src='file://"+audioFilePath+"' controls='controls'></audio>";
            result.resourceName = formatTimeStamp(createTime)+".mp3";
        }else {
            result.convertStatus = false;
            result.errorMessage = "[语音读取出错]";
        }
        //console.log("<<leave processAudio");
        return result;
    };
    $scope.processImage = function (localID,createTime) {
        //1. 根据localID定位到备份文件夹里的图片文件
        //2. 文件分两种，一种是pic_thum文件，缩略图文件，一种是pic文件，大图文件。
        //3. 拷贝到新目录下，大图放在image目录下，小图放在image/thumbnail下。图片名相同。
        //4. 数据库里面直接存图片名。
        //5. 读取数据库的时候手动加image和image/thumbnail
        //！！！可能存在的bug，即图片的时间戳相同，目标文件命名的问题
        var fs = require('fs');
        var fse = require('fs-extra');
        var path = require('path');
        var result={
            resourceName:"",
            thumbnailName:"",
            convertStatus:true,
            errorMessage:""
        };
        var thumbnailOrigin = $scope.documentsPath.imageFolder+"/"+localID+".pic_thum";
        var imageOrigin = $scope.documentsPath.imageFolder+"/"+localID+".pic";
        var thumbnailTarget = $scope.targetPath.imageThumbnailFolder+"/"+formatTimeStamp(createTime)+".jpg";
        var imageTarget = $scope.targetPath.imageFolder+"/"+formatTimeStamp(createTime)+".jpg";
        if(fs.existsSync(thumbnailOrigin))
        {
            try {
                fse.copySync(thumbnailOrigin, thumbnailTarget);
            }catch (error){
                console.error(error);
            }
        }else {
            result.errorMessage = "[图片缩略图不存在]";
            result.convertStatus = false;
        }
        if(fs.existsSync(imageOrigin))
        {
            try {
                fse.copySync(imageOrigin,imageTarget);
            }catch (error){
                console.error(error);
            }
        }else {
            result.convertStatus = false;
            result.errorMessage += "[图片原图不存在]";
        }
        result.resourceName = path.basename(imageTarget);
        result.thumbnailName = path.basename(thumbnailTarget)

        if(true)
        {

        }else {
            result.errorMessage = "[图片读取出错]";
        }

        return result;
    };
    $scope.processVideo = function (localID,createTime) {
        var fs = require('fs');
        var fse = require('fs-extra');
        var path = require('path');
        var result={
            resourceName:"",
            thumbnailName:"",
            convertStatus:true,
            errorMessage:""
        };
        var thumbnailOrigin = $scope.documentsPath.videoFolder+"/"+localID+".video_thum";
        var videoOrigin = $scope.documentsPath.videoFolder+"/"+localID+".mp4";
        var thumbnailTarget = $scope.targetPath.videoThumbnailFolder+"/"+formatTimeStamp(createTime)+".jpg";
        var videoTarget = $scope.targetPath.videoFolder+"/"+formatTimeStamp(createTime)+".mp4";
        if(fs.existsSync(thumbnailOrigin))
        {
            try {
                fse.copySync(thumbnailOrigin, thumbnailTarget);
            }catch (error){
                console.error(error);
            }
        }else {
            result.errorMessage = "[视频缩略图不存在]";
            result.convertStatus = false;
        }
        if(fs.existsSync(videoOrigin))
        {
            try {
                fse.copySync(videoOrigin,videoTarget);
            }catch (error){
                console.error(error);
            }
        }else {
            result.errorMessage += "[视频不存在]";
            result.convertStatus = false;

        }
        result.resourceName = path.basename(videoTarget);
        result.thumbnailName = path.basename(thumbnailTarget);
        return result;
    };
    $scope.startGeneration = function () {
        var fs = require("fs");
        var fse = require('fs-extra');
        var path = require("path");

        $scope.info = "数据解析中，请稍候...";
        var documentsPath = $scope.dPath;
        var wechatUserMD5 = $scope.wechatUserMD5;
        var chatTableName = $scope.chatTableName;


        $scope.startTimeStamp =  dateToTimestamp($scope.startDate);
        $scope.endTimeStamp = dateToTimestamp($scope.endDate);
        console.log($scope.startTimeStamp);
        console.log($scope.endTimeStamp);
        // 0.准备工作 a.设置好文件夹路径
        $scope.documentsPath.rootFolder = path.normalize(documentsPath);

        $scope.documentsPath.audioFolder = path.join($scope.documentsPath.rootFolder,wechatUserMD5,"Audio",getChatterMd5(chatTableName));
        $scope.documentsPath.imageFolder = path.join($scope.documentsPath.rootFolder,wechatUserMD5,"Img",getChatterMd5(chatTableName));
        $scope.documentsPath.videoFolder = path.join($scope.documentsPath.rootFolder,wechatUserMD5,"Video",getChatterMd5(chatTableName));
        //console.log("@@@");
        //console.log($scope.documentsPath);
        var sqliteFilePath = documentsPath+"/"+wechatUserMD5+"/DB/MM.sqlite";
        //$scope.targetPath.rootFolder = path.join(path.dirname(process.mainModule.filename),"output");
        $scope.targetPath.tmpFolder = path.join($scope.targetPath.rootFolder,".tmp");
        $scope.targetPath.resourceFolder = path.join($scope.targetPath.rootFolder,"resource");
        $scope.targetPath.audioFolder = path.join($scope.targetPath.rootFolder,"audio");
        $scope.targetPath.imageFolder = path.join($scope.targetPath.rootFolder,"image");
        $scope.targetPath.imageThumbnailFolder = path.join($scope.targetPath.rootFolder,"image","thumbnail");
        $scope.targetPath.videoFolder = path.join($scope.targetPath.rootFolder,"video");
        $scope.targetPath.videoThumbnailFolder = path.join($scope.targetPath.rootFolder,"video","thumbnail");
        //console.log("###");
        //console.log($scope.targetPath);
        //  1. 建立输出文件夹

        fse.emptyDirSync($scope.targetPath.rootFolder);// 保证output文件夹为空，不为空则清空，不存在则创建
        fs.mkdirSync($scope.targetPath.resourceFolder);
        fs.mkdirSync($scope.targetPath.audioFolder);
        fs.mkdirSync($scope.targetPath.tmpFolder);
        fs.mkdirSync($scope.targetPath.imageFolder);
        fs.mkdirSync($scope.targetPath.imageThumbnailFolder);
        fs.mkdirSync($scope.targetPath.videoFolder);
        fs.mkdirSync($scope.targetPath.videoThumbnailFolder);
        try {
            fse.copySync("./framework/data.sqlite", $scope.targetPath.rootFolder+"/data.sqlite");//拷贝数据库
            // fse.copySync(path.join($scope.documentsPath.rootFolder,wechatUserMD5,"mmsetting.archive"),path.join($scope.targetPath.tmpFolder,"mmsetting.plist"));//
        }catch (error){
            console.error(error);
        }

        //  2. 拷贝silk解码文件到指定audio目录下
        var srcPath = './framework/silk-v3-decoder'; //current folder
        var destPath = $scope.documentsPath.audioFolder; //
        console.log("开始拷贝silk-vs-decoder文件夹");
        // 拷贝文件夹及其子文件夹.
        try {
            fse.copySync(srcPath, destPath);
            console.log('拷贝silk-vs-decoder成功!')
        } catch (err) {
            console.error(err)
        }
        // 2.5 存储用户信息
        let buffer = {meInfo:$scope.meInfo,otherInfo:$scope.otherInfo,roomInfo:$scope.roomInfo};
        fs.writeFile(path.join($scope.targetPath.resourceFolder,'userData.json'), JSON.stringify(buffer), (err) => {
            if (err) throw err;
            console.log('The user data has been saved!');
        });
        // 2.6 存储图像
        let request = require("request");
        request($scope.meInfo['headUrl']).pipe(fs.createWriteStream(path.join($scope.targetPath.resourceFolder,'me.png')));
        if (!$scope.roomInfo.isChatRoom)
        {
            // alert($scope.otherWechatID);
            request($scope.otherInfo[$scope.otherWechatID]['headUrl']).pipe(fs.createWriteStream(path.join($scope.targetPath.resourceFolder, 'other.png')));
        }
        //  3.连接mm.sqlite数据库
        let sqlite3 = require('sqlite3');
        // 打开一个sqlite数据库
        console.log(sqliteFilePath);
        var originDb = new sqlite3.Database(sqliteFilePath,sqlite3.OPEN_READONLY,function (error) {
            if (error){
                console.log("Database error:",error);
            }
        });
        //  4.打开刚刚创建的数据库，用来存新格式的数据
        var newDb = new sqlite3.Database($scope.targetPath.rootFolder+"/data.sqlite",sqlite3.OPEN_READWRITE,function (error) {
            if (error) {
                console.log("data.sqlite error:", error);
            }
        });

        var sql = "SELECT * FROM " + chatTableName ;
        if($scope.startTimeStamp > 0 && $scope.endTimeStamp >0)
        {
            sql += " where CreateTime > "+$scope.startTimeStamp+" and CreateTime < "+$scope.endTimeStamp;
        }
        sql+=" order by CreateTime";
        console.log("generate sql: ",sql);
        var index = 1;
        //  5.逐条数据库信息获取
        originDb.each(sql,
            function (error,row) {
                // 回调函数，每获取一个条目，执行一次，第二个参数为当前条目
                var message = {
                    content:"",
                    type:"",
                    status:""
                };
                var result = {};
                console.log("type:",row.Type);
                switch(row.Type)
                {
                    case 1:// 文字消息
                        result = $scope.processText();
                        message.type = "文字消息";
                        break;
                    case 3:// 图片消息
                        result = $scope.processImage(row.MesLocalID,row.CreateTime);
                        message.type = "图片消息";
                        break;
                    case 34:// 语音消息
                        result = $scope.processAudio(row.MesLocalID,row.CreateTime);
                        message.type = "语音消息";
                        break;
                    case 42:// 名片
                        message.type = "名片";
                        break;
                    case 43:// 视频消息
                    case 62:// 小视频消息
                        result = $scope.processVideo(row.MesLocalID,row.CreateTime);
                        message.type = "视频消息";
                        break;
                    case 47:// 动画表情
                        message.type = "动画表情";
                        break;
                    case 48:// 位置
                        message.type = "位置";
                        break;
                    case 49:// 分享链接
                        message.type = "分享链接";
                        break;
                    case 50:// 语音、视频电话
                        message.type = "语音、视频电话";
                        break;
                    case 64:// 语音聊天
                        //TODO:增加对这个内容的解析
                        message.type = "语音聊天";
                        break;
                    case 10000:
                        //TODO:这个应该是撤回消息
                        message.type = "系统消息";
                        break;
                    default:
                        message.type = "其他类型消息";
                }
                newDb.run("INSERT INTO ChatData (MesLocalID,CreateTime,Message,Status,ImgStatus,Type,Des,resourceName,thumbnailName) VALUES (?,?,?,?,?,?,?,?,?);",
                    [row.MesLocalID,row.CreateTime,row.Message,row.Status,row.ImgStatus,row.Type,row.Des,result.resourceName,result.thumbnailName],function (error) {
                        if(error) {
                            console.log("插入数据库出错");
                            console.log(error);
                        }
                    });
                if(result.convertStatus == true){
                    message.status = "成功";
                }else{
                    message.status = result.errorMessage;
                }
                message.content = "处理第"+index+"条消息|消息类型："+message.type+"|处理状况："+message.status;
                console.log(message.content);

                index++;

            },
            function (error,result) {
                // complete
                if(!error){
                    $scope.totalTablesCount = result;
                    console.log("completed total tables Count:",result);
                    $scope.info = "数据解析完成,存储在："+$scope.targetPath.rootFolder;
                    $scope.$apply();
                    alert('数据解析完成！')
                }else{
                    console.log("complete error:",error);
                    $scope.info = "数据解析失败 ："+error;
                    $scope.$apply();
                    // alert('数据解析失败！ '+error)
                }
            });

    };

    $scope.Soft2Controller = function () {
        console.log("entry soft2 controller constructor");
    };
    $scope.Soft2Controller();
}]);
WechatBackupControllers.controller('Soft3Controller',["$scope","$state",function ($scope,$state) {
    $scope.page = "entry page";
    $scope.outputPath = "";
    $scope.generateHtml = false;
    $scope.showQqemoji = true;
    $scope.linesPerPage = 100;
    $scope.goToChatDetailPage = function () {
        $state.go('chatDetail',{
            outputPath:$scope.outputPath,
            generateHtml:$scope.generateHtml,
            showQqemoji:$scope.showQqemoji,
            linesPerPage:$scope.linesPerPage,
            ship:{a:"aa",b:"bb"}
        });
    };

    $scope.Soft3Controller = function () {
        console.log("entry soft3 controller constructor");
    };
    $scope.Soft3Controller();
}]);

WechatBackupControllers.controller('NewEntryController',["$scope","$state",function ($scope,$state) {
    $scope.page = "new entry page";
    $scope.dPath = "";
    $scope.myFriends = {};
    $scope.jumpToSoft1 = function () { $state.go('soft1') };
    $scope.jumpToSoft2 = function () { $state.go('soft2') };
    $scope.jumpToSoft3 = function () { $state.go('soft3') };
    $scope.jumpToSoft4 = function () { $state.go('soft4') };

    $scope.EntryController = function () {
        console.log("entry controller constructor");
    };
    $scope.EntryController();
}]);

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
function getNickName(fullNameInfo) {
    var sep = fullNameInfo.split("\"");
    sep.pop();
    return sep;
}
function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
        c = array[i++];
        switch(c >> 4)
        {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            // 0xxxxxxx
            out += String.fromCharCode(c);
            break;
            case 12: case 13:
            // 110x xxxx   10xx xxxx
            char2 = array[i++];
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}
function dateToTimestamp(date) {
    var timeStamp = Date.parse(new Date(date));
    timeStamp = timeStamp / 1000;
    return timeStamp
}
function savePic(url,savePath) {
    let request = require("request");
    request(url).pipe(fs.createWriteStream(path.join($scope.targetPath.resourceFolder,savePath)));
}