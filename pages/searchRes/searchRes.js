/*
* @File:   searchRes.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-20 18:08:28
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-21 21:32:32
* @Comment:
*/
var app = getApp();
Page({
	data: {
		scroll_sta: true,
		search_result: {},
		auto_complete_box: "auto_complete_box auto_complete_box_hidden",
		last_keyword: "",
		keyword: "",
		keywords: {},
		result_tips: ""
	},
	onLoad: function(opt){
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});

		var keyword = opt.keyword;
		this.setData({
			last_keyword: keyword
		});
		this.startSearch(keyword);
	},
	autoComplete: function(event){
		var that = this;
		that.setData({
			keyword: event.detail.value
		});
		var key = encodeURI(event.detail.value);
		if(key == "") {
			that.setData({
				keywords: {}
			});
		}
		wx.request({
			url: app.globalData.config.book.book_autocomplete + "?query=" + key,
			success: function(res){
				if(res.data.keywords.length>5){
					that.setData({
						keywords: res.data.keywords,
						auto_complete_box: "auto_complete_box auto_complete_box_height"
					});
				}else{
					that.setData({
						keywords: res.data.keywords,
						auto_complete_box: "auto_complete_box"
					});
				}
				
			}
		});
	},
	selectedKeyword: function(event){
		var keyword_index = event.currentTarget.dataset.index;
		var keyword = this.data.keywords[keyword_index];
		this.setData({
			last_keyword: keyword
		});
		this.startSearch(keyword);
	},
	search: function(){
		var keyword = this.data.keyword;
		if(keyword != "") {
			this.startSearch(keyword);
		}
	},
	removeTips: function(event){
		if(event.target.dataset.id != "search"){
			this.setData({
				scroll_sta: true,
				auto_complete_box: this.data.auto_complete_box+" auto_complete_box_hidden"
			});
		}else{
			this.setData({
				scroll_sta: false
			});
		}
	},
	startSearch: function(keyword){
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});
		var that = this;
		this.setData({
			auto_complete_box: this.data.auto_complete_box+" auto_complete_box_hidden"
		});
		var url = app.globalData.config.book.book_search+"?query="+keyword;
		wx.request({
			url: url,
			success: function(res){
				that.setData({
					search_result: res.data.books,
					result_tips: "未找到相关书籍~O~"
				});
				wx.hideLoading();
			},
			fail: function(){
				wx.hideLoading();
				that.setData({
					result_tips: "网络错误，请稍后再试~"
				});
				wx.showModal({
					title: "网络错误，请稍后再试~"
				});
			}
		});
	}
})