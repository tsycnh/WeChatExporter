/**
 * Created by shidanlifuhetian on 2017/2/1.
 */
var NwBuilder = require('nw-builder');

var nw = new NwBuilder({
    files: './package.json', // 包含文件
    platforms: ['osx64'], // 打包的平台
    version: '0.19.3', // 使用 NW.js 的版本
    cacheDir:'../nwCache',// nwjs文件缓存位置
    buildDir:'../nwBuild',
    appName:'weback',
    appVersion:'0.0.1',
    flavor:'sdk'
});

nw.on('log', console.log); // 日志打印函数

// 开始构建
nw.build().then(function(){
    console.log('done!');
}).catch(function(err){
    console.log(err);
});