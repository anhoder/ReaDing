/*
* @File:   searchRes.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-20 18:08:28
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-21 21:32:32
* @Comment:
*/
import IndexRequest from '../../requests/IndexRequest.js'
import SearchRequest from '../../requests/SearchRequest.js';

var indexRequest = new IndexRequest();
var searchRequest = new SearchRequest();
var app = getApp();


Page({
	data: {
		scroll_sta: true,
		search_result: [],
		auto_complete_box: "auto_complete_box auto_complete_box_hidden",
		last_keyword: "",
		keyword: "",
		keywords: [],
		result_tips: "",
    page: 1,
    token: "",
    userId: 0
	},

  /**
   * 加载完钩子
   */
	onLoad: function(opt){
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});

    var userInfo = wx.getStorageSync('user');
		var keyword = opt.keyword;
		this.setData({keyword, last_keyword: keyword, token: userInfo.token, userId: userInfo.userId});
		this.startSearch(keyword);
	},


  /**
   * 自动补全
   */
  autoComplete: function (event) {
    var that = this;
    that.setData({
      keyword: event.detail.value
    });
    var key = encodeURI(event.detail.value);
    if (key == "") {
      indexRequest.getHotWords({ token: this.data.token, userId: this.data.userId }, res => {
        that.setData({
          keywords: res.data.data,
          auto_complete_box: "auto_complete_box auto_complete_box_height"
        });
      });
    } else {
      indexRequest.getAutoComplete(key, { token: this.data.token, userId: this.data.userId }, res => {
        var words = res.data.data.map(item => item.name);
        if (words.length > 5) {
          that.setData({
            keywords: words,
            auto_complete_box: "auto_complete_box auto_complete_box_height"
          });
        } else {
          that.setData({
            keywords: words,
            auto_complete_box: "auto_complete_box"
          });
        }
      }, () => {
        wx.hideLoading();
        wx.showModal({ title: "网络错误，请稍后再试" });
      }
      );
    }
  },


  /**
   * 选择词条
   */
	selectedKeyword: function(event){
		var keyword_index = event.currentTarget.dataset.index;
		var keyword = this.data.keywords[keyword_index];
		this.setData({
      search_result: [],
			last_keyword: keyword
		});
		this.startSearch(keyword);
	},


  /**
   * 搜索
   */
	search: function(){
		var keyword = this.data.keyword;
    this.setData({search_result: []});
		if(keyword != "") {
			this.startSearch(keyword);
		}
	},


  /**
   * 移除词条
   */
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


  /**
   * 开始搜索
   */
	startSearch: function(keyword){
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});
		var that = this;
		this.setData({
			auto_complete_box: this.data.auto_complete_box+" auto_complete_box_hidden"
		});
    searchRequest.getSearchBooks(keyword, this.data.page, {token: this.data.token, userId: this.data.userId}, res => {
        that.setData({search_result: that.data.search_result.concat(res.data.data.list)});
        console.debug(res.data.data.list);
        wx.hideLoading();
      }
    );
	},

  
  /**
   * 获取下一页搜索结果
   */
  nextPage: function () {
    console.log(this.data.keyword);
    this.setData({
      page: this.data.page + 1
    });
    this.startSearch(this.data.keyword);
  }
})