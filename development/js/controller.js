var WechatBackupControllers = angular.module('WechatBackupControllers',[]);
WechatBackupControllers.controller('EntryController',["$scope","$state",function ($scope,$state) {
    $scope.page = "entry page";
    $scope.outputPath = "/Users/shidanlifuhetian/Desktop/output";
    $scope.goToChatDetailPage = function () {
        $state.go('chatDetail',{outputPath:$scope.outputPath});
    };

    $scope.documentsPath = {
        rootFolder:"",
        audioFolder:"",
        imageFolder:"",
        videoFolder:""
    };
    $scope.targetPath={
        rootFolder:"/Users/shidanlifuhetian/Desktop/output",
        audioFolder:"",
        imageFolder:"",
        imageThumbnailFolder:"",
        videoFolder:"",
        videoThumbnailFolder:""
    };

    $scope.onFileChange = function (files) {
        console.log(files);
        $scope.sqlFile = files[0].path;
    };
    $scope.processText = function () {
        return {
            resourceUrl:"",
            convertStatus:true,
            errorMessage:""
        }
    };
    $scope.processAudio = function (localID,createTime) {
        //1. 根据localID定位到备份文件夹里的aud文件

        var fs = require('fs');
        var fse = require('fs-extra');
        var path = require('path');
        var result={
            resourceUrl:"",
            convertStatus:true,
            errorMessage:""
        };
        //var data = fs.readFileSync($scope.audioFolderPath+"/"+row.MesLocalID+".mp3");
        //2. 调用子进程来转换为MP3文件,并拷贝到新文件夹下
        //3. 返回新MP3的相对url地址
            var command = $scope.documentsPath.audioFolder + "/converter.sh "+localID + ".aud mp3";
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
                result.resourceUrl = path.join("audio",formatTimeStamp(createTime)+".mp3");
            }else {
                result.convertStatus = false;
                result.errorMessage = "[语音读取出错]";
            }

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
            resourceUrl:"",
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
        result.resourceUrl = path.basename(thumbnailTarget);

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
            resourceUrl:"",
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
        result.resourceUrl = path.basename(thumbnailTarget);


        return result;
    };
    $scope.startGeneration = function (documentsPath, wechatUserMD5, chatTableName) {
        var fs = require("fs");
        var fse = require('fs-extra');
        var path = require("path");
        console.log("enter startGeneration");
        // 0.准备工作 a.设置好文件夹路径
        $scope.documentsPath.rootFolder = path.normalize(documentsPath);
        $scope.documentsPath.audioFolder = path.join($scope.documentsPath.rootFolder,wechatUserMD5,"Audio",getChatterMd5(chatTableName));
        $scope.documentsPath.imageFolder = path.join($scope.documentsPath.rootFolder,wechatUserMD5,"Img",getChatterMd5(chatTableName));
        $scope.documentsPath.videoFolder = path.join($scope.documentsPath.rootFolder,wechatUserMD5,"Video",getChatterMd5(chatTableName));
        //console.log("@@@");
        //console.log($scope.documentsPath);
        var sqliteFilePath = documentsPath+"/"+wechatUserMD5+"/DB/MM.sqlite";
        //$scope.targetPath.rootFolder = path.join(path.dirname(process.mainModule.filename),"output");
        $scope.targetPath.audioFolder = path.join($scope.targetPath.rootFolder,"audio");
        $scope.targetPath.imageFolder = path.join($scope.targetPath.rootFolder,"image");
        $scope.targetPath.imageThumbnailFolder = path.join($scope.targetPath.rootFolder,"image","thumbnail");
        $scope.targetPath.videoFolder = path.join($scope.targetPath.rootFolder,"video");
        $scope.targetPath.videoThumbnailFolder = path.join($scope.targetPath.rootFolder,"video","thumbnail");
        //console.log("###");
        //console.log($scope.targetPath);
        //  1. 建立输出文件夹

        fse.emptyDirSync($scope.targetPath.rootFolder);// 保证output文件夹为空，不为空则清空，不存在则创建
        fs.mkdirSync($scope.targetPath.audioFolder);
        fs.mkdirSync($scope.targetPath.imageFolder);
        fs.mkdirSync($scope.targetPath.imageThumbnailFolder);
        fs.mkdirSync($scope.targetPath.videoFolder);
        fs.mkdirSync($scope.targetPath.videoThumbnailFolder);
        try {
            fse.copySync("./framework/data.sqlite", $scope.targetPath.rootFolder+"/data.sqlite");//拷贝数据库
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

        //  3.连接mm.sqlite数据库
        var sqlite3 = require('sqlite3');
        // 打开一个sqlite数据库
        console.log(sqliteFilePath);
        var db = new sqlite3.Database(sqliteFilePath,sqlite3.OPEN_READONLY,function (error) {
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
        var sql = "SELECT * FROM "+chatTableName+" order by CreateTime";
        var index = 1;
        //  5.逐条数据库信息获取
        db.each(sql,
            function (error,row) {
            // 回调函数，每获取一个条目，执行一次，第二个参数为当前条目
                var message = {
                    content:"",
                    type:"",
                    status:""
                };
                var result = {};
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
                    case 43:// 视频消息
                    case 62:// 小视频消息
                        result = $scope.processVideo(row.MesLocalID,row.CreateTime);
                        message.type = "视频消息";
                        break;
                    case 47:// 动画表情
                        //message.content = "动画表情";
                        message.type = "动画表情";
                        break;
                    case 49:// 分享链接
                        //message.content = "分享链接";
                        message.type = "分享链接";
                        break;
                    case 48:// 位置
                        //message.content = "位置";
                        message.type = "位置";
                        break;
                    case 42:// 名片
                        //message.content = "名片";
                        message.type = "名片";
                        break;
                    case 50:// 语音、视频电话
                        message.type = "语音、视频电话";
                        break;
                    default:
                        message.type = "其他类型消息";
                        //message.content = "未知消息类型：type id:"+rows[i].Type;
                }
                newDb.run("INSERT INTO ChatData (MesLocalID,CreateTime,Message,Status,ImgStatus,Type,Des,resourceUrl) VALUES (?,?,?,?,?,?,?,?);",
                    [row.MesLocalID,row.CreateTime,row.Message,row.Status,row.ImgStatus,row.Type,row.Des,result.resourceUrl]);
                if(result.convertStatus == true){
                    message.status = "成功";
                }else{
                    message.status = result.errorMessage;
                }
                //message.status = result.convertStatus == true?"成功":"失败"

                message.content = "处理第"+index+"条消息|消息类型："+message.type+"|处理状况："+message.status;
                console.log(message.content);

                index++;

        },
            function (error,result) {
            // complete
            if(!error){
                $scope.totalTablesCount = result;
                console.log("completed total tables Count:",result);
            }else{
                console.log("complete error:",error);
            }
        });

    };
    $scope.loadDocuments = function (documentsPath) {
        console.log(documentsPath);
        $state.go('chatList',{documentsPath:documentsPath});
    };
    $scope.EntryController = function () {
        console.log("entry controller constructor");
    };
    $scope.EntryController();
}]);
WechatBackupControllers.controller('TopBarController',["$scope","$rootScope",function ($scope,$rootScope) {
}]);
// chatList.html页面的controller
WechatBackupControllers.controller('ChatListController',["$scope","$state", "$stateParams",function ($scope,$state, $stateParams) {
    $scope.wechatUserList = [];
    $scope.dbTables = [];
    $scope.totalTablesCount = -1;
    $scope.tableSelected = "";
    $scope.previewData = [];
    $scope.filePath = "";
    $scope.documentsPath = $stateParams.documentsPath;


    // "构造函数"，页面载入的时候执行
    $scope.ChatListController = function () {
        console.log("constructor");
        console.log($stateParams);
        // 1. 查看当前目录下的所有文件
        var fs = require('fs');
        var documentsFileList = fs.readdirSync($scope.documentsPath);
        // 2. 找到符合md5格式的文件夹        // 3. 将这几个文件夹的显示在页面上
        for(var i=0;i<documentsFileList.length;i++)
        {
            //console.log(documentsFileList[i].length);
            if(documentsFileList[i].length == 32 && documentsFileList[i]!="00000000000000000000000000000000"){
                console.log(documentsFileList[i]);
                $scope.wechatUserList.push(documentsFileList[i]);
            }
        }
        //$scope.$apply();


        // sqlite3相关文档：https://github.com/mapbox/node-sqlite3/wiki/API
        /*
        var sqlite3 = require('sqlite3');
        // 打开一个sqlite数据库
        var db = new sqlite3.Database($scope.filePath,sqlite3.OPEN_READONLY,function (error) {
            if (error){
                console.log("Database error:",error);
            }
        });

        // 查找数据库内的所有table，并逐个遍历
         db.each("select * from SQLITE_MASTER where type = 'table' and name like 'Chat/_%' ESCAPE '/' ;",function (error,row) {
             // 回调函数，没获取一个条目，执行一次，第二个参数为当前条目

             // 声明一个promise，将条目的name传入resolve
            var getRowName = new Promise(function (resolve,reject) {
                if(!error)
                {
                    //console.log("row name: ",row.name);
                    resolve(row.name);
                    // let sql = "select count(*) as count from "+ row.name;
                    // let r = db.get(sql,function (error,result) {
                    //     if(!error)
                    //         console.log("get:",result);
                    //     else
                    //         console.log("get error:",error);
                    // });
                    // console.log("row count: ",r);
                }else{
                    //console.log("row error:",error);
                    reject(error);
                }
            });
             // 声明一个带参数的promise，写法和getRowName略有不同
             var getCount = function (rowName) {
                 var promise = new Promise(function (resolve,reject) {
                     ///
                     var sql = "select count(*) as count from "+ rowName;
                     var r = db.get(sql,function (error,result) {
                         if(!error) {
                             //console.log("count:", result.count);
                             //将传入的rowName和结果的count数一并传出去
                             resolve([rowName,result.count]);
                         }
                         else {
                             console.log("count error:", error);
                             reject(error)
                         }
                     });
                     ///
                 });
                 return promise;
             };
             // 执行promise。
             // 先getRowName,然后每获取到一个rowName就传入到getCount函数内，接着一个.then().里面输出的就是rowName和count一一对应的数组
            getRowName
                .then(getCount)
                .then(function (result) {
                //

                    db.get("select count(*) as count,MesSvrID as serverID from "+result[0],function (error, row) {
                        //console.log(row);
                        if(!(row.count <= 10))
                        {
                            console.log("rowName:",result[0],"count:",result[1]);
                             $scope.dbTables.push(result);
                            // if($scope.dbTables.length == $scope.totalTablesCount){
                            //     console.log("scope apply1,tables count:",$scope.dbTables.length)
                            //     $scope.$apply();
                            // }
                        }
                        $scope.$apply();
                    });
            });
        },function (error,result) {
            if(!error){
                $scope.totalTablesCount = result;
                console.log("completed total tables Count:",result);
            }else{
                console.log("complete error:",error);
            }
        });
        */
    };
    // 执行"构造函数"
    $scope.ChatListController();

    $scope.onFilesSelected = function(files) {
        console.log("files - " + files);
    };
    $scope.onWechatUserMD5Selected = function(wechatUserMD5){
        console.log(wechatUserMD5);
        $scope.dbTables =[];
        // 1.   定位到当前目录的mmsqlite文件

        var sqlitefilePath = $scope.documentsPath+"/"+wechatUserMD5+"/DB/MM.sqlite";
        $scope.filePath = sqlitefilePath;
        // sqlite3相关文档：https://github.com/mapbox/node-sqlite3/wiki/API

        var sqlite3 = require('sqlite3');
        // 打开一个sqlite数据库
        var db = new sqlite3.Database(sqlitefilePath,sqlite3.OPEN_READONLY,function (error) {
            if (error){
                console.log("Database error:",error);
            }
        });

        // 查找数据库内的所有table，并逐个遍历
        db.each("select * from SQLITE_MASTER where type = 'table' and name like 'Chat/_%' ESCAPE '/' ;",function (error,row) {
            // 回调函数，没获取一个条目，执行一次，第二个参数为当前条目

            // 声明一个promise，将条目的name传入resolve
            var getRowName = new Promise(function (resolve,reject) {
                if(!error)
                {
                    //console.log("row name: ",row.name);
                    resolve(row.name);
                    // let sql = "select count(*) as count from "+ row.name;
                    // let r = db.get(sql,function (error,result) {
                    //     if(!error)
                    //         console.log("get:",result);
                    //     else
                    //         console.log("get error:",error);
                    // });
                    // console.log("row count: ",r);
                }else{
                    //console.log("row error:",error);
                    reject(error);
                }
            });
            // 声明一个带参数的promise，写法和getRowName略有不同
            var getCount = function (rowName) {
                var promise = new Promise(function (resolve,reject) {
                    ///
                    var sql = "select count(*) as count from "+ rowName;
                    var r = db.get(sql,function (error,result) {
                        if(!error) {
                            //console.log("count:", result.count);
                            //将传入的rowName和结果的count数一并传出去
                            resolve([rowName,result.count]);
                        }
                        else {
                            console.log("count error:", error);
                            reject(error)
                        }
                    });
                    ///
                });
                return promise;
            };
            // 执行promise。
            // 先getRowName,然后每获取到一个rowName就传入到getCount函数内，接着一个.then().里面输出的就是rowName和count一一对应的数组
            getRowName
                .then(getCount)
                .then(function (result) {
                    db.get("select count(*) as count,MesSvrID as serverID from "+result[0],function (error, row) {
                        //console.log(row);
                        if(!(row.count <= 10))
                        {
                            console.log("rowName:",result[0],"count:",result[1]);
                            $scope.dbTables.push(result);
                            // if($scope.dbTables.length == $scope.totalTablesCount){
                            //     console.log("scope apply1,tables count:",$scope.dbTables.length)
                            //     $scope.$apply();
                            // }
                        }
                        $scope.$apply();
                    });
                });
        },function (error,result) {
            if(!error){
                $scope.totalTablesCount = result;
                console.log("completed total tables Count:",result);
            }else{
                console.log("complete error:",error);
            }
        });
    };
    // 用户在左侧选择了具体table
    $scope.onChatTableSelected = function (tableName) {
        //alert(tableName);
        $scope.tableSelected = tableName;
        $scope.previewData = [];
        // sqlite3相关文档：https://github.com/mapbox/node-sqlite3/wiki/API
        var sqlite3 = require('sqlite3');
        // 打开一个sqlite数据库
        var db = new sqlite3.Database($scope.filePath,sqlite3.OPEN_READONLY,function (error) {
            if (error){
                console.log("Database error:",error);
            }
        });

        var sql = "SELECT * FROM "+$scope.tableSelected+" order by CreateTime desc limit 10";
        db.all(sql, function(err, rows) {
            for(var i in rows){
                var time = formatTimeStamp(rows[i].CreateTime)
                //console.log(time);

                $scope.previewData.push({
                    time:time,
                    message:rows[i].Message
                })
            }
            //console.log("scope apply,previewData count:",$scope.previewData.length)

            $scope.$apply();

        });
    };

    $scope.exportChat = function (tableName) {
        $state.go('chatDetail',{tableName:tableName,sqliteFilePath:$stateParams.sqliteFilePath});
    }
}]);
