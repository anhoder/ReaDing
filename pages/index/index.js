var app = getApp();
Page({
	data: {
		scroll_sta: true,
		// 滑动
		search_style: "search",
		recommend_cat_style: "recommend_cat",
		// 选择
		recommend_cat_selected: {
			0: "recommend_cat_selected",
			1: ""
		},
		recommend_cat_selected_flag: 1,
		// request获取数据
		male_rank: {},
		female_rank: {},
		request_flag: 0,
		// 当前显示
		now_rank: {},
		show_num: 1,
		// 搜索自动补全
		keyword: "",
		keywords: {},
		last_keyword: "",
		auto_complete_box: "auto_complete_box auto_complete_box_hidden"
	},
	onLoad: function(){
		// console.log(app.globalData.config);
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});
		var that = this;
		wx.request({
			url: app.globalData.config.rank.rank_categories,
			success: function(res){
				wx.request({
					url: app.globalData.config.rank.rank_info+"/"+res.data.male[0]._id,
					success: function(res1){
						that.setData({
							male_rank: res1.data.ranking,
							request_flag: that.data.request_flag+1,
							now_rank: res1.data.ranking
						});
						// console.log(that.data.now_rank);
						if(that.data.request_flag == 2) wx.hideLoading();
					},
					fail: function(){
						wx.hideLoading();
						wx.showModal({
							title: "网络错误，请稍后再试"
						});
					}
				});
				wx.request({
					url: app.globalData.config.rank.rank_info+"/"+res.data.female[0]._id,
					success: function(res2){
						that.setData({
							female_rank: res2.data.ranking,
							request_flag: that.data.request_flag+1
						});
						if(that.data.request_flag == 2) wx.hideLoading();
					},
					fail: function(){
						wx.hideLoading();
						wx.showModal({
							title: "网络错误，请稍后再试"
						});
					}
				});
			},
			fail: function(){
				wx.hideLoading();
				wx.showModal({
					title: "网络错误，请稍后再试"
				});
			}
		});
	},
	toBookInfo: function(event){
		// console.log(event.currentTarget.dataset.book);
		var book = event.currentTarget.dataset.book;
		wx.navigateTo({
			url: "../bookinfo/bookinfo?book=" + book
		});
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
		this.setData({
			last_keyword: this.data.keywords[keyword_index]
		});
		wx.navigateTo({
			url: "/pages/searchRes/searchRes?keyword="+this.data.keywords[keyword_index]
		});
	},
	search: function(){
		var keyword = this.data.keyword;
		if(keyword != "") {
			wx.navigateTo({
				url: "/pages/searchRes/searchRes?keyword="+keyword
			});
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
	// changeStyle: function(event){
	// 	if(event.detail.scrollTop >= 190) {
	// 		this.setData({
	// 			// search_style: "search search_fixed",
	// 			recommend_cat_style: "recommend_cat recommend_cat_fixed"
	// 		});
	// 	}else if(event.detail.scrollTop < 190){
	// 		this.setData({
	// 			// search_style: "search",
	// 			recommend_cat_style: "recommend_cat"
	// 		});
	// 	}
	// },
	selectMale: function(){
		if(this.data.recommend_cat_selected_flag != 1){
			this.setData({
				recommend_cat_selected: {
					0: "recommend_cat_selected",
					1: ""
				},
				recommend_cat_selected_flag: 1,
				now_rank: this.data.male_rank
			});
		}

	},
	selectFemale: function(){
		if(this.data.recommend_cat_selected_flag != 2){
			this.setData({
				recommend_cat_selected: {
					0: "",
					1: "recommend_cat_selected"
				},
				recommend_cat_selected_flag: 2,
				now_rank: this.data.female_rank
			});
		}

	},
	showMore: function(){
		if(this.data.show_num < 10){
			this.setData({
				show_num: this.data.show_num+1
			});
		}
	},
	onShareAppMessage: function(){
  		return {
      		title: '阅鼑(Reading)',
      		path: '/pages/index/index',
      		success: function(res) {
        		// 转发成功
        		wx.showToast({
        			title: "转发成功",
        			icon: "success"
        		});
      		}
    	}
  	}
})