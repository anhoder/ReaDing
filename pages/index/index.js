import IndexRequest from '../../requests/IndexRequest.js';

var app = getApp();
var request = new IndexRequest();

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
		male_rank: [],
		female_rank: [],
		request_flag: 0,
		// 当前显示
		now_rank: [],
		show_num: 1,

    banner: [],

		// 搜索自动补全
		keyword: "",
		keywords: {},
		last_keyword: "",
		auto_complete_box: "auto_complete_box auto_complete_box_hidden",
    // 用户TOKEN
    token: "",
    userId: 0
	},


	onLoad: function(){
		// console.log(app.globalData.config);
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});

    var user = wx.getStorageSync('user');
    
    if (!user) {
      var that = this;
      // 获取Token
      request.getToken(res => {
        var userInfo = {
          token: res.data.data.token,
          userId: res.data.data.user_id
        };
        that.setData({ request_flag: ++that.data.request_flag, ...userInfo });
        wx.setStorage({
          key: 'user',
          data: userInfo,
        });
        that.getRandomBooks(1, 4);
        that.getRandomBooks(2, 4);
        that.getBanner(4);
        if (that.data.request_flag == 4) wx.hideLoading();
      });
    } else {
      this.setData(user);
      this.getRandomBooks(1, 3);
      this.getRandomBooks(2, 3);
      this.getBanner(3);
    }
	},


  /**
   * 获取Banner图
   */
  getBanner: function (times) {
    var that = this;
    request.getBanner({token: this.data.token, userId: this.data.userId}, res => {
      that.setData({ banner: res.data.data.banner, request_flag: ++that.data.request_flag });
      if (that.data.request_flag >= times) wx.hideLoading();
    });
  },


  /**
   * 获取随机书
   */
  getRandomBooks: function(maleType = 1, times) {
    var that = this;
    request.getRandomBooks(maleType, {token: this.data.token, userId: this.data.userId}, res => {
        if (maleType == 1) {
          var data = {
            male_rank: that.data.male_rank.concat(res.data.data),
            request_flag: ++that.data.request_flag
          };
          if (that.data.recommend_cat_selected_flag == 1) {
            data = {
              now_rank: that.data.male_rank.concat(res.data.data),
              ...data
            };
          }
          that.setData(data);
        } else {
          var data = {
            female_rank: that.data.female_rank.concat(res.data.data),
            request_flag: ++that.data.request_flag
          };
          if (that.data.recommend_cat_selected_flag == 2) {
            data = {
              now_rank: that.data.female_rank.concat(res.data.data),
              ...data
            };
          }
          that.setData(data);
        }
        if (that.data.request_flag >= times) wx.hideLoading();
      }
    );
  },


  /**
   * 跳转到书籍详情
   */
	toBookInfo: function(event){
		// console.log(event.currentTarget.dataset.book);
		var book = event.currentTarget.dataset.book;
		wx.navigateTo({
			url: "../bookinfo/bookinfo?book=" + book
		});
	},


  /**
   * 搜索自动补全
   */
	autoComplete: function(event){
		var that = this;
		that.setData({
			keyword: event.detail.value
		});
		var key = encodeURI(event.detail.value);
		if(key == "") {
      request.getHotWords({token: this.data.token, userId: this.data.userId}, res => {
          that.setData({
            keywords: res.data.data,
            auto_complete_box: "auto_complete_box auto_complete_box_height"
          });
        }
      );
		} else {
      request.getAutoComplete(key, {token: this.data.token, userId: this.data.userId}, res => {
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
        }
      );
    }
	},


  /**
   * 选择词条
   */
	selectedKeyword: function(event){
		var keyword_index = event.currentTarget.dataset.index;
		this.setData({
			last_keyword: this.data.keywords[keyword_index]
		});
		wx.navigateTo({
			url: "/pages/searchRes/searchRes?keyword="+this.data.keywords[keyword_index]
		});
	},


  /**
   * 点击搜索按钮
   */
	search: function(){
		var keyword = this.data.keyword;
		if(keyword != "") {
			wx.navigateTo({
				url: "/pages/searchRes/searchRes?keyword="+keyword
			});
		}
	},


  /**
   * 移除搜索提示
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


  /**
   * 选择男生
   */
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


  /**
   * 选择女生
   */
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


  /**
   * 下拉更多
   */
	showMore: function(){
    this.getRandomBooks(this.data.recommend_cat_selected_flag);
    this.setData({
      show_num: this.data.show_num+1
    });
	},


  /**
   * 转发
   */
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