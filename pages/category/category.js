/*
* @File:   category.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-25 10:25:57
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-25 16:32:56
* @Comment:
*/
import CategoryRequest from '../../requests/CategoryRequest.js';

var app = getApp();
var categoryRequest = new CategoryRequest();

Page({


	data: {
		male_select: "male_select",
    female_select: "",
    press_select: "",
    cover: "cover_male",
    cats_info: [],
    ltype_id: 0,
    sub_cats: [],
    cat_name: "",
    sex: 1, // 1男 2女
    top: 0
	},


	onLoad: function(){
		wx.showLoading({
      "title": "加载中...",
      "duration": 20000
    });
    var user = wx.getStorageSync("user");
    this.setData({user});
    this.getCats();
	},


  /**
   * 获取分类
   */
	getCats: function(){
		var that = this;
    categoryRequest.getCategories(this.data.sex, this.data.user, (res) => {
      that.setData({
        cats_info: res.data.data,
        cat_name: res.data.data[0].ltype_name,
        sub_cats: res.data.data[0].ltype_list,
        ltype_id: res.data.data[0].ltype_id
      });
      wx.hideLoading();
    });
	},


  /**
   * 选择男生
   */
	male_tap: function(){
    if (this.data.sex != 1) {
      this.setData({
        male_select: "male_select",
        female_select: "",
        press_select: "",
        cover: "cover_male",
        top: 0,
        sex: 1,
      });
      this.getCats();
    }
	},


  /**
   * 选择女生
   */
	female_tap: function(){
    if (this.data.sex != 2) {
      this.setData({
        male_select: "",
        female_select: "female_select",
        press_select: "",
        cover: "cover_female",
        top: 0,
        sex: 2
      });
      this.getCats();
    }
	},


  /**
   * 二级分类
   */
	showSubCats:function(e){
		var cat_index = e.target.dataset.index;
		this.setData({
			top: 100 * cat_index,
			cat_name: this.data.cats_info[cat_index].ltype_name,
      sub_cats: this.data.cats_info[cat_index].ltype_list,
      ltype_id: this.data.cats_info[cat_index].ltype_id
		});

	},


  /**
   * 跳转到分类详情页
   */
	toCatInfo: function(e){
		var sex = this.data.sex;
    var stype_id = e.target.dataset.id;
    var ltype_id = this.data.ltype_id;
    var type_name = this.data.cat_name + ' ' + e.target.dataset.name
		wx.navigateTo({
      url: `/pages/catedetail/catedetail?sex=${sex}&ltype=${ltype_id}&stype=${stype_id}&title=${type_name}`
		});
	}
})