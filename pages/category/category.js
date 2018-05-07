/*
* @File:   category.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-25 10:25:57
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-25 16:32:56
* @Comment:
*/

var app = getApp();
Page({
	data: {
		male_select: "male_select",
	  	female_select: "",
	  	press_select: "",
	  	cover: "cover_male",
	  	cats_info: {},
	  	show_cats: {},
	  	sub_cats: {},
	  	cat_name: "",
	  	top: 0,
	  	selected_gender: ""
	},
	onLoad: function(){
		wx.showLoading({
	      "title": "加载中...",
	      "duration": 20000
	    });
	    this.getCats();
	},
	getCats: function(){
		var that = this;
  		var url = app.globalData.config.category.sub_categories;
	  	wx.request({
	  		url: url,
	  		success: function(res){
	  			// console.log(res.data);
	  			that.setData({
	  				cats_info: res.data,
	  				show_cats: res.data.male,
	  				sub_cats: res.data.male[0].mins,
	  				cat_name: res.data.male[0].major,
	  				selected_gender: "male"
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
		  	press_select: "",
		  	cover: "cover_male",
		  	show_cats: this.data.cats_info.male,
		  	cat_name: this.data.cats_info.male[0].major,
		  	top: 0,
			sub_cats: this.data.cats_info.male[0].mins,
			selected_gender: "male"
	  	});
	},
	female_tap: function(){
	  	this.setData({
	  		male_select: "",
		  	female_select: "female_select",
		  	press_select: "",
		  	cover: "cover_female",
		  	show_cats: this.data.cats_info.female,
		  	cat_name: this.data.cats_info.female[0].major,
		  	top: 0,
			sub_cats: this.data.cats_info.female[0].mins,
			selected_gender: "female"
	  	});
	},
	press_tap: function(){
	  	this.setData({
	  		male_select: "",
		  	female_select: "",
		  	press_select: "press_select",
		  	cover: "cover_press",
		  	show_cats: this.data.cats_info.press,
		  	cat_name: this.data.cats_info.press[0].major,
		  	top: 0,
			sub_cats: this.data.cats_info.press[0].mins,
			selected_gender: "press"
	  	});
	},
	showSubCats:function(e){
		var cat_index = e.target.dataset.index;
		this.setData({
			top: 100*cat_index,
			cat_name: this.data.show_cats[cat_index].major,
			sub_cats: this.data.show_cats[cat_index].mins
		});

	},
	toCatInfo: function(e){
		var gender = this.data.selected_gender;
		var major = this.data.cat_name;
		var minor = e.target.dataset.name;
		// console.log(gender);
		// console.log(major);
		// console.log(minor);
		wx.navigateTo({
			  url: "/pages/catedetail/catedetail?gender="+gender+"&major="+major+"&minor="+minor
		});
	}
})