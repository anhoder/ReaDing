/*
* @File:   rank.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-24 23:17:59
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-25 10:48:49
* @Comment:
*/
import RankRequest from '../../requests/RankRequest.js';

var app = getApp();
var rankRequest = new RankRequest();

Page({
  data:{
  	rank_categories: [],
    sex: 1, // 1男 2女
  	male_select: "male_select",
  	female_select: "",
  	cover: "cover_male",
    user: {}
  },


  onLoad: function(){
  	wx.showLoading({
      "title": "加载中...",
      "duration": 20000
    });
    var user = wx.getStorageSync('user');
    this.setData({user});
    this.getRanks();
  },


  /**
   * 获取排行榜信息
   */
  getRanks: function(){
  	var that = this;
    rankRequest.getRanks(this.data.sex, this.data.user, res => {
        that.setData({
          rank_categories: res.data.data.map(item => {item.title = item.name.split('.')[1];return item;})
        });
        wx.hideLoading();
      }
    );
  },


  /**
   * 切换到男生
   */
  male_tap: function(){
    if (this.data.sex != 1) {
      this.setData({
        male_select: "male_select",
        female_select: "",
        cover: "cover_male",
        sex: 1
      });
      this.getRanks();
    }
  },

  /**
   * 切换到女生
   */
  female_tap: function(){
    if (this.data.sex != 2) {
      this.setData({
        male_select: "",
        female_select: "female_select",
        cover: "cover_female",
        sex: 2
      });
      this.getRanks();
    }
  }
})