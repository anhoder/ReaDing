/*
* @File:   catedetail.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-25 16:21:13
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-25 18:07:13
* @Comment:
*/
import CategoryRequest from '../../requests/CategoryRequest.js';

var app = getApp();
var categoryRequest = new CategoryRequest();

Page({

	data: {
		cat_books: [],
		sex: 1,
		ltype: -1,
		stype: -1,
    page: 1,
    user: {},
		loading_style: "loading_hide"
	},


	onLoad: function(opt){
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});
    var user = wx.getStorageSync("user");
    var ltype = opt.ltype;
    var stype = opt.stype;
    var sex = opt.sex;
		wx.setNavigationBarTitle({
      title: opt.title
		});
		this.setData({
      ltype,
      stype,
      sex,
      user
		});
		this.getCateDetail();
	},


  /**
   * 获取分类详情
   */
	getCateDetail: function(){
		var that = this;
    categoryRequest.getCategoryInfo(
      this.data.sex, this.data.ltype, this.data.stype, 
      this.data.page, this.data.user, res => {
        that.setData({
          cat_books: that.data.cat_books.concat(res.data.data.list),
          loading_style: "loading_hide"
        });
        wx.hideLoading();
      }
    );
  },

  /**
   * 更多
   */
	showMore: function(){
		this.setData({
			loading_style: "loading_show",
      page: this.data.page + 1
		});
		this.getCateDetail();
	}
})