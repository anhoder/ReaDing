/*
* @File:   rank.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-24 23:17:59
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-25 10:48:49
* @Comment:
*/

var app = getApp();

Page({
  data:{
  	rank_categories: {},
  	show_rank_categories: {},
  	male_select: "male_select",
  	female_select: "",
  	cover: "cover_male"
  },
  onLoad: function(){
  	wx.showLoading({
      "title": "加载中...",
      "duration": 20000
    });
    this.getRank();
  },
  getRank: function(){
  	var that = this;
  	var url = app.globalData.config.rank.rank_categories;
  	wx.request({
  		url: url,
  		success: function(res){
  			// console.log(res.data);
  			that.setData({
  				rank_categories: res.data,
  				show_rank_categories: res.data.male
  			});
  			wx.hideLoading();
  		},
  		fail: function(){
	        wx.hideLoading();
	        wx.showModal({
	          title: "网络错误，请稍后再试~"
	        });
	    }
  	});
  },
  male_tap: function(){
  	this.setData({
  		male_select: "male_select",
	  	female_select: "",
	  	cover: "cover_male",
	  	show_rank_categories: this.data.rank_categories.male
  	});
  },
  female_tap: function(){
  	this.setData({
  		male_select: "",
	  	female_select: "female_select",
	  	cover: "cover_female",
	  	show_rank_categories: this.data.rank_categories.female
  	});
  }
})