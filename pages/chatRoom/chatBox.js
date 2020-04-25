// pages/contact/contact.js
const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;

const recorderManager = wx.getRecorderManager();

var WxParse = require('../../wxParse/html2json.js');
/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';
  msgList = [{
    speaker: 'server',
    contentType: 'text',
    content: "欢迎来到月月问答室，有关电影方面的问题都可以提问哦，回复'问答'获取问题类型哦！",
    imgUrl:'',
  }]
  var htmlAry = [];

  htmlAry[0] = WxParse.html2json(msgList[0].content, 'returnData');//重点，就是这里。只要这么干就能直接获取到转化后的node格式数据；
    
  
  that.setData({
    msgList,
    inputVal,
    htmlAry: htmlAry,
  })
}

/**
 * 计算msg总高度
 */
function calScrollHeight(that, keyHeight) {
 var query = wx.createSelectorQuery();
 query.select('.scrollMsg').boundingClientRect(function(rect) {
 }).exec();
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
    inputValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initData(this);
    // this.setData({
    //   cusHeadIcon: app.globalData.userInfo.avatarUrl,
    // });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
     calScrollHeight(this, keyHeight);

  },

  wxParseTagATap:function(e){
    var href = e.currentTarget.dataset.src;
    var new_problem = href[1];
    this.setData({ inputValue: new_problem });
    this.sendClick()
  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  bindKeyInput:function(e){
    this.setData({inputValue : e.detail.value});
  },
  

  /**
   * 发送点击监听
   */
  sendClick: function () {
    let that = this;
    var input = this.data.inputValue;
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: input,
      imgUrl: ''
    })
    inputVal = '';
    that.setData({
      msgList,
      inputVal,
    });
   
    wx.request({
      url: 'https://www.wechat-applet.top/getToast',
      method: 'GET',
      data: {
        info: input
      },
    
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
       
      success: function (res) {

        let message = res.data
  
        var img = ""
        //person_info
        var person_info = message.person_info
        var person_name = message.person_name
        var person_other_name = message.person_other_name
        var person_gender = message.person_gender
        var person_birthplace = message.person_birthplace
        var person_birthday = message.person_birthday
        var person_constellation = message.person_constellation
        var person_profession = message.person_profession
        var person_introduction = message.person_introduction
        var person_image = message.person_image
        if (person_name
          && person_other_name
          && person_gender
          && person_birthplace
          && person_birthday
          && person_constellation
          && person_profession
          && person_introduction
          && person_image != undefined) {
          var img = person_image
          var data = person_info
          var arr = []
          arr = person_profession.replace(/\s*/g, "").split("/");
          var newarr = []
          for (var i =0 ; i<arr.length;i++){
            if (arr[i]=='演员'){
              arr[i] = "<a href=' " + person_name + "出演过什么电影'>" + arr[i] + '</a>' 
            }
            else if (arr[i] == '导演'){
              arr[i] = "<a href=' " + person_name + "导演过什么电影'>" + arr[i] + '</a>' 
            }
            else if (arr[i] == '编剧') {
              arr[i] = "<a href=' " + person_name + "编写过什么电影'>" + arr[i] + '</a>'
            }
          }
          if (img.length > 5000) {
            data += "姓名：  " + person_name + "<br />"+
              "别名：  " + person_other_name + "<br />" +
              "性别：  " + person_gender + "<br />" +
              "出生地：" + person_birthplace + "<br />"+
              "生日：  " + person_birthday + "<br />" +
              "星座：  " + person_constellation + "<br />" +
              "职业：  " + arr.join(',') + "<br />" +
              "简介：  " + person_introduction + "<br />" +
              "照片：  " + "<br />"
          }
          else{
            data += "姓名：  " + person_name + "<br />" +
              "别名：  " + person_other_name + "<br />" +
              "性别：  " + person_gender + "<br />" +
              "出生地：" + person_birthplace + "<br />"+
              "生日：  " + person_birthday + "<br />" +
              "星座：  " + person_constellation + "<br />" +
              "职业：  " + arr.join(',') + "<br />" +
              "简介：  " + person_introduction + "<br />" +
              "照片：  " + person_image + "<br />"  
          }
        }
        
        //movie_info
        var movie_info = message.movie_info
        var movie_name = message.movie_name
        var movie_other_name = message.movie_other_name
        var movie_country = message.movie_country
        var movie_language = message.movie_language
        var movie_date = message.movie_date
        var movie_duration = message.movie_duration
        var movie_score = message.movie_score
        var movie_tag = message.movie_tag
        var movie_introduction = message.movie_introduction
        var movie_image = message.movie_image
        if (movie_name
          && movie_other_name
          && movie_country
          && movie_language
          && movie_date
          && movie_duration
          && movie_score
          && movie_tag && movie_introduction && movie_image  != undefined) {
            var img = movie_image
            var data = movie_info
            if(img.length>5000){
              data += "电影名称: " + movie_name + "<br />" +
              "别名:     " + movie_other_name + "<br />" +
              "发行国家: " + movie_country + "<br />" +
              "语言:     " + movie_language + "<br />" +
              "演员：    " + "<a href=' " + movie_name + "的演员'>" + '点此获取' + '</a>' + "<br />" +
              "上映日期: " + movie_date + "<br />" +
              "片长:     " + movie_duration + "<br />" +
              "评分:     " + movie_score + "<br />" +
              "标签:     " + movie_tag + "<br />" +
              "电影简述: " + movie_introduction + "<br />" +
              "电影封面: " + "<br />"
            }
            else{
              data += "电影名称: " + movie_name + "<br />" +
                "别名:     " + movie_other_name + "<br />" +
                "发行国家: " + movie_country + "<br />" +
                "语言:     " + movie_language + "<br />" +
                "演员：    " + "<a href=' " + movie_name + "的演员'>" + '点此获取' + '</a>' + "<br />" +
                "上映日期: " + movie_date + "<br />" +
                "片长:     " + movie_duration + "<br />" +
                "评分:     " + movie_score + "<br />" +
                "标签:     " + movie_tag + "<br />" +
                "电影简述: " + movie_introduction + "<br />" +
                "电影封面: " + movie_image 
            }
        }

        //movie_list
        var movie_list_info = message.movie_list_info
        var movie_list = message.movie_list
        if (movie_list_info != undefined && movie_list != undefined) {
          var data = movie_list_info
          for (var obj in movie_list) {
            data += '<br />' + "<a href=' " + movie_list[obj].movie_name+ "的信息'>" + movie_list[obj].movie_name + '-----' + movie_list[obj].movie_score + '</a>'
          }
         
        }
       

        //person_list
        var person_list_info = message.person_list_info
        var person_list = message.person_list
        if (person_list_info != undefined && person_list != undefined) {
          var data = person_list_info
          for (var obj in person_list) {
            data += '<br />' + "<a href=' " + person_list[obj].person_name + "的信息'>" + person_list[obj].person_name + '----------'  + person_list[obj].person_movie_num + '</a>'
          }
        }

        //cooperate_list
        var cooperate_info = message.cooperate_info
        var cooperate_list = message.cooperate_list

        if (cooperate_info != undefined && cooperate_list!= undefined) {
          var data = cooperate_info
          for (var obj in cooperate_list) {
            data += '<br />' + "<a href=' " + cooperate_list[obj].cooperate_name + "的信息'>" + cooperate_list[obj].cooperate_name + '</a>' + ' ---------- ' + "<a href=' " + cooperate_list[obj].ori_name + "和" + cooperate_list[obj].cooperate_name + "合作过哪些电影'>" + cooperate_list[obj].cooperate_times + '</a>' 
          }
        }
       

        //hot_list
        var hot_info = message.hot_info
        var hot_list = message.hot_list

        if (hot_info != undefined && hot_list != undefined) {
          var data = message.hot_info
          for (var obj in hot_list) {
            data += '<br />' + "<a href=' " + hot_list[obj].hot_name + "的信息'>" + hot_list[obj].hot_name + '  ' + hot_list[obj].hot_rating  + '</a>' + '------' + hot_list[obj].hot_time 
          }
        }
        
        //siminfo_list
        var siminfo_info = message.siminfo_info
        var siminfo_data = message.siminfo_data

        if (siminfo_info != undefined && siminfo_data != undefined) {
          
          if (siminfo_data.length>10000){
            var data = siminfo_info
            var img = siminfo_data
          }
          var data = siminfo_info + siminfo_data
        }
        
        //若都为空的话 返回result为不知道 或者为预定义事件
        var result_info = message.result_info
        if (result_info != undefined){
          var data = result_info
        }

        //图片信息的显示
        
        console.log(data)
        msgList.push({
          speaker: 'server',
          contentType: 'text',
          content:data,
          imgUrl: img
        })
        var htmlAry = [];

        for (let i = 0; i < msgList.length; i++) {
          if (msgList[i].contentType == 'text') {
            htmlAry[i] = WxParse.html2json(msgList[i].content, 'returnData');//重点，就是这里。只要这么干就能直接获取到转化后的node格式数据；
          }
        }
        that.setData({
          msgList,
          inputVal,
          htmlAry: htmlAry,
        })

      }
    })
  },
 /**
  * 语音识别
  */
  
  handleTouchStart: function (e) {
    //录音参数
    const options = {
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'PCM'
    }
    //开启录音
    recorderManager.start(options);
    console.log('recorder start')
    wx.showLoading({
      title: '正在识别中...',
    })
  },
  handleTouchEnd: function (e) {
    recorderManager.stop();
    console.log('recorder stop')
    this.bindRecorderStopEvent()
  },

  bindRecorderStopEvent: function () {
    let that = this;
    recorderManager.onStop((res) => {
      var baiduBccessToken = wx.getStorageSync("baidu_yuyin_access_token");
      var tempFilePath = res.tempFilePath;//音频文件地址
      // var fileSize = res.fileSize;
      const fs = wx.getFileSystemManager();
      fs.readFile({//读取文件并转为ArrayBuffer
        filePath: tempFilePath,
        success(res) {
          const base64 = wx.arrayBufferToBase64(res.data);
          var fileSize = res.data.byteLength;
          wx.request({
            url: 'https://vop.baidu.com/server_api',
            data: {
              format: 'pcm',
              rate: 16000,
              channel: 1,
              cuid: 'sdfdfdfsfs',
              token: baiduBccessToken,
              speech: base64,
              len: fileSize
            },
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              wx.hideLoading();
              var result = res.data.result;
              if (result != undefined){
                if (result.length == 0) {
                  wx.showToast({
                    title: "未识别到语音信息!",
                    icon: 'none',
                    duration: 3000
                  })
                  result = ["未识别出结果，请重试或者使用文字输入"]
                }
              }
              else{
                result = ["未识别出结果，请重试或者使用文字输入"]
              }
              var keyword = result[0];
              keyword = keyword.replace("。", "");
              console.log(keyword)
              that.setData({
                 inputValue: keyword
                  });
              that.sendClick()
            }
          })
        }
      })
    })
  },


  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  },
  vibrateShortTap: function () {
    // 使手机振动15ms
    wx.vibrateLong();
  }
})