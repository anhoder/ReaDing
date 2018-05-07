/*
* @File:   rank_detail.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-25 09:10:29
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-25 10:24:07
* @Comment:
*/
var app = getApp();
Page({
	data: {
		rank_id: "",
		show_num: 1
	},
	onLoad: function(opt){
		wx.showLoading({
	      	"title": "加载中...",
	      	"duration": 20000
	    });
		this.setData({
			rank_id: opt.rank_id
		});
		this.getRankDetail();
	},
	getRankDetail: function(){
	  	var that = this;
	  	var url = app.globalData.config.rank.rank_info+"/"+that.data.rank_id;
	  	wx.request({
	  		url: url,
	  		success: function(res){
	  			// console.log(res.data);
	  			that.setData({
	  				rank_info: res.data.ranking
	  			});
	  			wx.setNavigationBarTitle({  
			      	title: res.data.ranking.title
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
  	showMore: function(){
		if(this.data.show_num < 10){
			this.setData({
				show_num: this.data.show_num+1
			});
		}
	},
})