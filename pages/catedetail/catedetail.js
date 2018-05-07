/*
* @File:   catedetail.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-25 16:21:13
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-25 18:07:13
* @Comment:
*/

var app = getApp();
Page({
	data: {
		cate_detail: new Array(),
		gender: "",
		major: "",
		minor: "",
		loading_style: "loading_hide"
	},
	onLoad: function(opt){
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});
		var gender = opt.gender;
		var major = opt.major;
		var minor = opt.minor;
		wx.setNavigationBarTitle({
			title: major+"　"+minor
		});
		this.setData({
			gender: gender,
			major: major,
			minor: minor
		});
		var start = 0;
		var limit = 10;
		var type = "hot";
		this.getCateDetail(gender, major, minor, type, start, limit);
	},
	getCateDetail: function(gender, major, minor, type, start, limit){
		var that = this;
		var major = encodeURI(major);
		var minor = encodeURI(minor);
		var url = app.globalData.config.category.category_info+"?gender="+gender+"&type="+type+"&major="+major+"&minor="+minor+"&start="+start+"&limit="+limit;
		// console.log(url);
		wx.request({
			url: url,
			success: function(res){
				var cate_detail = that.data.cate_detail;
				cate_detail = cate_detail.concat(res.data.books);
				that.setData({
					cate_detail: cate_detail,
					loading_style: "loading_hide"
				});
				// console.log(that.data.cate_detail);
				wx.hideLoading();
			},
			fail: function(){
				wx.hideLoading();
				wx.showModal({
					title: "网络错误，请稍后再试"
				});
			}
		});
	},
	showMore: function(){
		this.setData({
			loading_style: "loading_show"
		});
		var gender = this.data.gender;
		var major = this.data.major;
		var minor = this.data.minor;
		var type = "hot";
		var start = this.data.cate_detail.length;
		var limit = 10;
		this.getCateDetail(gender, major, minor, type, start, limit);
	}
})