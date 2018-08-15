/**
 * Created by shidanlifuhetian on 2018/8/15.
 */
var a = '�http://wx.qlogo.cn/mmhead/ver_1/EWy0UPv28fp38aVoicR53T0knBSOibS9icwPfWdf4bMzN0U2viauaJSfpgtpZu33elJIeh8WTvKVNEEGKLg2IhTWbPp0ubldvW8XjvlTdnP2FcM/132�http://wx.qlogo.cn/mmhead/ver_1/EWy0UPv28fp38aVoicR53T0knBSOibS9icwPfWdf4bMzN0U2viauaJSfpgtpZu33elJIeh8WTvKVNEEGKLg2IhTWbPp0ubldvW8XjvlTdnP2FcM/0" 11238b564a0970fcfbdba1a939a65cbf';
var i = a.indexOf("/132")
console.log(i)
var b = a.slice(0,i+4)
console.log(b)
var i2 = b.indexOf('http:')
var c = b.slice(i2)
console.log(c)