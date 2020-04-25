//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {
      baiduyuyin: {
        apiKey: 'R8ugPruqdtuyC5MGp3ZDn2lK',
        secretKey: 'w0AYwiHH5eLCBRn2obdAY9ZWarOQmrEQ',
        url: 'https://openapi.baidu.com/oauth/2.0/token'
      }
    }
  },
  onShow(options) {
    let that = this
    that.initBaiduYuyinAccessToken();
  },
  //初始化语音识别 baiduBccessToken
  initBaiduYuyinAccessToken: function () {
    var that = this;
    var baiduBccessToken = wx.getStorageSync("baidu_yuyin_access_token");
    
    if (baiduBccessToken == undefined || baiduBccessToken == '') {
      that.getBaiduYuyinAccessToken();
    } else {
      var baiduTime = wx.getStorageSync("baidu_yuyin_time");
      var timeNum = new Date(parseInt(new Date().getTime() - baiduTime) * 1000).getDay();
      if (timeNum > 28) {
        that.getBaiduAccessToken();
      }
    }
  },
  getBaiduYuyinAccessToken: function () {
    var that = this;
    var baiduyuyin = that.globalData.baiduyuyin;
    console.log(baiduyuyin);
    wx.request({
      url: baiduyuyin.url,
      data: {
        grant_type: 'client_credentials',
        client_id: baiduyuyin.apiKey,
        client_secret: baiduyuyin.secretKey
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.setStorageSync("baidu_yuyin_access_token", res.data.access_token);
        wx.setStorageSync("baidu_yuyin_time", new Date().getTime());
      }
    })
  },



  // getUserInfo:function(cb){
  //   var that = this
  //   if(this.globalData.userInfo){
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   }else{
  //     //调用登录接口
  //     wx.login({
  //       success: function () {
  //         wx.getUserInfo({
  //           success: function (res) {
  //             that.globalData.userInfo = res.userInfo
  //             typeof cb == "function" && cb(that.globalData.userInfo)
  //           }
  //         })
  //       }
  //     })
  //   }
  // },



  globalData:{
    userInfo:null
  }
})