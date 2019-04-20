/**
 * Created by shidanlifuhetian on 2017/3/11.
 */
// chatDetail.html页面的controller
WechatBackupControllers.controller('ChatDetailController',["$scope","$timeout","$state", "$stateParams",function ($scope,$timeout, $state, $stateParams) {

    $scope.outputPath={
        rootFolder:"",
        sqliteFile:"",
        resourceFolder:"",
        audioFolder:"",
        imageFolder:"",
        imageThumbnailFolder:"",
        videoFolder:"",
        videoThumbnailFolder:""
    };
    $scope.generateHtml = false;
    $scope.showQqemoji = false;
    $scope.chatData = [];
    $scope.pageLink = [];
    $scope.qqEmoji = {};
    $scope.meInfo = {};
    $scope.otherInfo = {};
    $scope.scrollToBottom = -1;
    $scope.count = 0;
    $scope.db = {};             // 数据库
    $scope.limitStart = 0;      // 加载起始位置（包含）
    $scope.limitGap = 0;       // 每次加载limitGap条消息，默认50,即每页显示多少条信息

    $scope.lastTimeStamp = 0;       // 前一条消息的时间戳
    $scope.currentTimeStamp = 0;    // 当前一条消息的时间戳

    $scope.totalMessageCount = 0;
    $scope.totalPageCount = 0;

    $scope.currentPage = -1;
    //检测是否存在音频解码器
    $scope.audioDecoderExist = function () {
        var fs = require('fs');

        if(!fs.existsSync($scope.audioFolderPath+"/converter.sh")) return false;
        if(!fs.existsSync($scope.audioFolderPath+"/ffmpeg")) return false;
        if(!fs.existsSync($scope.audioFolderPath+"/silk/decoder")) return false;
        if(!fs.existsSync($scope.audioFolderPath+"/silk/libSKP_SILK_SDK.a")) return false;

        return true;
    };
    // 加载聊天记录
    $scope.loadMore = function () {
        var sql = "SELECT * FROM ChatData order by CreateTime limit "+$scope.limitStart+","+$scope.limitGap;
        //var sql = "SELECT * FROM ChatData order by CreateTime limit 1000";
        console.log("loadMore sql:");
        console.log(sql);
        $scope.db.all(sql, function(err, rows) {
            for (var i in rows){
                var message = {
                    owner:rows[i].Des,
                    content:"",
                    time:""
                };
                $scope.currentTimeStamp = rows[i].CreateTime;
                if ($scope.currentTimeStamp - $scope.lastTimeStamp > 60*5)
                {
                    message.time = formatTimeStamp2($scope.currentTimeStamp);
                }
                $scope.lastTimeStamp = $scope.currentTimeStamp;
                switch(rows[i].Type)
                {
                    case 1:// 文字消息
                        message.content = $scope.templateMessage(rows[i]);
                        break;
                    case 3:// 图片消息
                        message.content = $scope.templateImage(rows[i]);
                        break;
                    case 34:// 语音消息
                        message.content = $scope.templateAudio(rows[i]);
                        break;
                    case 43:// 视频消息
                        message.content = $scope.templateVideo(rows[i]);
                        break;
                    case 62:// 小视频消息
                        message.content = $scope.templateVideo(rows[i]);
                        break;
                    case 47:// 动画表情
                        message.content = "[动画表情]";
                        break;
                    case 49:// 分享链接
                        message.content = "[分享链接]";
                        break;
                    case 48:// 位置
                        message.content = "[位置]";
                        break;
                    case 42:// 名片
                        message.content = "[名片]";
                        break;
                    case 50:// 语音、视频电话
                        message.content = "[语音、视频电话]";
                        break;
                    case 10000:// 语音、视频电话
                        message.content = "[系统消息]";
                        break;
                    default:
                        message.content = "[未知消息类型：type id:"+rows[i].Type+"]";
                }
                $scope.chatData.push(message);
            }
            //$scope.chatData = rows;
            //console.log("scope apply,chatData:",$scope.chatData);
            $scope.$apply();
            $scope.limitStart += $scope.limitGap;
            console.log("load More done");
            $scope.saveRawHtml();
        });

    };
    $scope.refreshPageLink = function () {
        // 9 in total
        $scope.pageLink = [];
        for(var i = - 4;i<=4;i++) {
            if($scope.currentPage+i > 0 && $scope.currentPage+i<=$scope.totalPageCount) {
                $scope.pageLink.push($scope.currentPage + i);
            }
        }
    };
    $scope.goToPage = function (pageIndex) {
        $scope.chatData = [];// 清空聊天数据

        $scope.currentPage = pageIndex;
        $scope.limitStart = (pageIndex - 1)*$scope.limitGap;
        var sql = "SELECT * FROM ChatData order by CreateTime limit "+$scope.limitStart+","+$scope.limitGap;
        //var sql = "SELECT * FROM ChatData order by CreateTime limit 1000";
        $timeout(function(){
            $scope.refreshPageLink();
        });
        console.log("loadMore sql:");
        console.log(sql);
        $scope.db.all(sql, function(err, rows) {
            for (var i in rows){
                var message = {
                    owner:rows[i].Des,
                    content:"",
                    time:""
                };
                $scope.currentTimeStamp = rows[i].CreateTime;
                if ($scope.currentTimeStamp - $scope.lastTimeStamp > 60*5)
                {
                    message.time = formatTimeStamp2($scope.currentTimeStamp);
                }
                $scope.lastTimeStamp = $scope.currentTimeStamp;
                //console.log(rows[i]);
                switch(rows[i].Type)
                {
                    case 1:// 文字消息
                        message.content = $scope.templateMessage(rows[i]);
                        break;
                    case 3:// 图片消息
                        message.content = $scope.templateImage(rows[i]);
                        break;
                    case 34:// 语音消息
                        message.content = $scope.templateAudio(rows[i]);
                        break;
                    case 43:// 视频消息
                        message.content = $scope.templateVideo(rows[i]);
                        break;
                    case 62:// 小视频消息
                        message.content = $scope.templateVideo(rows[i]);
                        break;
                    case 47:// 动画表情
                        message.content = "[动画表情]";
                        break;
                    case 49:// 分享链接
                        message.content = "[分享链接]";
                        break;
                    case 48:// 位置
                        message.content = "[位置]";
                        break;
                    case 42:// 名片
                        message.content = "[名片]";
                        break;
                    case 50:// 语音、视频电话
                        message.content = "[语音、视频电话]";
                        break;
                    default:
                        message.content = "[未知消息类型：type id:"+rows[i].Type+"]";
                }
                $scope.chatData.push(message);
            }
            $scope.$apply();
            console.log("load More done");
            console.log($scope.generateHtml);
            if($scope.generateHtml == "true"){
                $scope.saveRawHtml();
                if($scope.currentPage!=$scope.totalPageCount){
                    $scope.goToPage($scope.currentPage+1);
                }
            }
        });
    };
    // 构造函数
    $scope.ChatDetailController = function () {
        console.log("enter ChatDetailController");
        console.log($stateParams);
        $scope.generateHtml = $stateParams.generateHtml;
        $scope.showQqemoji = $stateParams.showQqemoji;
        $scope.limitGap = $stateParams.linesPerPage;
        var path = require('path');
        var sqlite3 = require('sqlite3');
        var fse = require('fs-extra');
        $scope.qqEmoji = fse.readJsonSync('./resources/qqemoji.json');

        $scope.outputPath.rootFolder = $stateParams.outputPath;
        $scope.outputPath.sqliteFile = path.join($scope.outputPath.rootFolder,"data.sqlite");
        $scope.outputPath.audioFolder = path.join($scope.outputPath.rootFolder,"audio");
        $scope.outputPath.imageFolder = path.join($scope.outputPath.rootFolder,"image");
        $scope.outputPath.imageThumbnailFolder = path.join($scope.outputPath.rootFolder,"image","thumbnail");
        $scope.outputPath.videoFolder = path.join($scope.outputPath.rootFolder,"video");
        $scope.outputPath.videoThumbnailFolder = path.join($scope.outputPath.rootFolder,"video","thumbnail");
        $scope.outputPath.resourceFolder = path.join($scope.outputPath.rootFolder,"resource");

        $scope.meInfo['headPath'] = path.join('file://',$scope.outputPath.resourceFolder,'me.png')
        $scope.otherInfo['headPath'] = path.join('file://',$scope.outputPath.resourceFolder,'other.png')

        console.log($scope.outputPath);

        //- 打开sqlite数据库
        $scope.db = new sqlite3.Database($scope.outputPath.sqliteFile,sqlite3.OPEN_READONLY,function (error) {
            if (error){console.log("Database error:",error);}
        });
        //- 计算一共有多少页
        var sqlite = require('sqlite-sync'); //requiring
        sqlite.connect($scope.outputPath.sqliteFile);
        $scope.totalMessageCount = sqlite.run("SELECT count(*) as count from ChatData")[0].count;
        $scope.totalPageCount = Math.ceil($scope.totalMessageCount/$scope.limitGap);

        $scope.currentPage = 1;
        //- 按照limit规则，每按一次loadMore载入指定数量的消息
        //$scope.loadMore();// 载入数据库内容
        if($scope.generateHtml == "true")
        {
            fse.emptyDirSync("../distHtml");
        }
        $scope.goToPage($scope.currentPage);
    };
    $scope.ChatDetailController();

    $scope.inputChange = function () {
        console.log("input Change");
    };
    $scope.$watch('scrollToBottom',function (newValue,oldValue) {
        $scope.count++;
        console.log("angular detect scroll,count:",$scope.count);
        console.log("new:",newValue," old:",oldValue);
        //$scope.$apply();
    });

    $scope.templateMessage = function(row) {
        if($scope.showQqemoji == "true") {
            return $scope.messageAddQQemoji(row.Message);
        }else{
            return row.Message;
        }
    };
    $scope.templateImage = function (row) {
        var fs = require('fs');
        var path = require('path');
        var imgTag = "";
        if (fs.existsSync(path.join($scope.outputPath.imageThumbnailFolder,row.thumbnailName))){
            var data = fs.readFileSync(path.join($scope.outputPath.imageThumbnailFolder, row.thumbnailName));
            imgTag = "<img>";
            if (data != undefined) {
                var a = data.toString("base64");
                imgTag = "<img src='data:image/jpeg;base64," + a + "'/>";
            }
        }else {
            imgTag="[图片不存在]";
        }
        return imgTag;
    };
    $scope.templateAudio = function (row) {
        var fs = require('fs');
        var path = require('path');
        //var data = fs.readFileSync($scope.audioFolderPath+"/"+row.MesLocalID+".mp3");
        var audioFilePath = path.join($scope.outputPath.audioFolder,row.resourceName);
        //console.log(audioFilePath);
        var audioTag = "<audio></audio>";
        if(fs.existsSync(audioFilePath))// 若文件存在
        {
            audioTag = "<audio src='file://"+audioFilePath+"' controls='controls'></audio>";
        }else{
            audioTag = "[语音读取出错]";
        }

        return audioTag;
    };
    $scope.templateVideo = function (row) {
        var fs = require('fs');
        var path = require('path');
        var videoFilePath = path.join($scope.outputPath.videoFolder,row.resourceName);
        var videoTag = "<video></video>";
        if(fs.existsSync(videoFilePath))// 若文件存在
        {
            videoTag = "<video src='file://"+videoFilePath+"' controls='controls'></video>";
        }else{
            var videoFileThumbnailPath = path.join($scope.outputPath.videoThumbnailFolder,row.thumbnailName);
            //console.log(videoFileThumbnailPath);
            if(fs.existsSync(videoFileThumbnailPath)) {
                var data = fs.readFileSync(videoFileThumbnailPath);

            if(data != undefined) {
                var a = data.toString("base64");
                videoTag = "<img src='data:image/jpeg;base64," + a + "'/>";
            }
            }
            videoTag += "<p>【视频不存在】";
        }
        return videoTag;
    };

    $scope.messageAddQQemoji = function (message) {
        var pattern = /\[[^\[\]]*]/g;
        var allMatch = [];
        while ((match = pattern.exec(message)) != null) {
            allMatch.push(
                {
                    content:match[0],
                    index:match.index,
                    length:match[0].length,
                    imgTag:""
                }
            )
        }
        for (var i in allMatch)
        {
            allMatch[i].imgTag = $scope.QQemojiToImgTag(allMatch[i].content);
            if(allMatch[i].imgTag == allMatch[i].content)
            {
                console.log("未能解析的qqemoji: ",allMatch[i].content);
            }
            message = message.replace(allMatch[i].content,allMatch[i].imgTag);
        }
        return message;
    };
    $scope.QQemojiToImgTag = function (str) {
        var emojiIndex = $scope.qqEmoji[str];
        if (emojiIndex >= 0)
        {
            return "<img class='qqemoji qqemoji"+emojiIndex+"' src='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='>";
        }else {
            return str;
        }
    };

    $scope.saveRawHtml = function () {
        var fs = require('fs-extra');
        var markup = document.documentElement.outerHTML;
        fs.writeFileSync("../distHtml/index_"+$scope.currentPage+".html",markup);
    };

    $scope.on_message_click = function(){
        console.log("message clicked!");
    };
}]);