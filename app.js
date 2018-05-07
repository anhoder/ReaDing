/*
* @File:   app.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-16 17:23:14
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-21 21:19:27
* @Comment:
*/

App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var config = require('config/config.js');
    this.globalData = config;
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },
  globalData: {
    config: null
  }
})

