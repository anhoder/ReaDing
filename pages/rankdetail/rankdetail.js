/*
* @File:   rank_detail.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-25 09:10:29
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-25 10:24:07
* @Comment:
*/
import RankRequest from '../../requests/RankRequest.js';

var app = getApp();
var rankRequest = new RankRequest();

Page({

	data: {
		rank_id: "",
    rank_info: [],
    subType: 1,
    week_select: "week_select",
    month_select: "",
    all_select: "",
    cover: "cover_week",
    show_num: 1,
	},


	onLoad: function(opt){
		wx.showLoading({
      "title": "加载中...",
      "duration": 20000
    });
    wx.setNavigationBarTitle({
      title: opt.title
    });
    var user = wx.getStorageSync("user");
		this.setData({
			rank_id: opt.rank_id,
      user
    });
		this.getRankDetail();
	},

  /**
   * 获取排行榜详情
   */
	getRankDetail: function(append = false){
    var that = this;
    rankRequest.getRankInfo(this.data.rank_id, this.data.subType, this.data.show_num, this.data.user, res => {
        if (append) {
          that.setData({
            rank_info: that.data.rank_info.concat(res.data.data.list)
          });  
        } else {
          that.setData({
            rank_info: res.data.data.list
          });
        }
        
        wx.hideLoading();
      }
    );
  },

  /**
   * 周排行
   */
  week_tap: function () {
    if (this.data.subType != 1) {
      this.setData({
        subType: 1,
        week_select: "week_select",
        month_select: "",
        all_select: "",
        cover: "cover_week",
      });
      this.getRankDetail();
    }
  },

  /**
   * 月排行
   */
  month_tap: function () {
    if (this.data.subType != 2) {
      this.setData({
        subType: 2,
        week_select: "",
        month_select: "month_select",
        all_select: "",
        cover: "cover_month",
      });
      this.getRankDetail();
    }
  },

  /**
   * 总排行
   */
  all_tap: function () {
    if (this.data.subType != 3) {
      this.setData({
        subType: 3,
        week_select: "",
        month_select: "",
        all_select: "all_select",
        cover: "cover_all",
      });
      this.getRankDetail();
    }
  },


  /**
   * 下拉更多
   */
  showMore: function () {
    this.setData({
      show_num: this.data.show_num + 1
    });
    this.getRankDetail(true);
  },
})