/*
* @File:   bookinfo.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-19 22:18:08
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-24 09:26:52
* @Comment:
*/
var app = getApp();
Page({
	data:{
		book_info: {},
		book_source_info:{},
		related_books: {},
		book_reviews: {},
		// select_source_tips: "选择书源",
		source_temp: new Array(),
		index: -1,
		source_id: "",
		mybooks: new Array(),
		add_book_stat: "加入书架",
		add_to_mybooks_style: "add_to_mybooks",
		add_fun: "addToMybooks",
		get_data_flag: 0
	},
	onLoad: function(opt){
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});
		var that = this;
		var book_id = opt.book;
		var url = app.globalData.config.book.book_info+"/"+book_id;
		wx.request({
			url: url,
			success: function(res){
				that.setData({
					book_info: res.data
				});
				that.getBookSource(res.data._id);
				that.getRelatedBooks(res.data._id);
				that.getBookReviews(res.data._id);
			},
			fail: function(){
				wx.hideLoading();
				wx.showModal({
					title: "网络错误，请稍后再试"
				});
			}

		});
	},
	getBookSource: function(book){
		var that = this;
		var url = app.globalData.config.book.book_sources+"?view=summary&book="+book;
		wx.request({
			url: url,
			success: function(res){
				var temp = new Array();
				for(var i=0; i<res.data.length; i++){
					temp[i] = res.data[i].name;
				}
				that.setData({
					book_source_info: res.data,
					get_data_flag: that.data.get_data_flag+1,
					source_temp: temp
				});
				if(that.data.get_data_flag == 4) wx.hideLoading();
				// console.log(that.data.book_source_info);
				that.getMyBooks();
			},
			fail: function(){
				wx.hideLoading();
				wx.showModal({
					title: "网络错误，请稍后再试"
				});
			}
		});
	},
	getRelatedBooks: function(book){
		var that = this;
		var url = app.globalData.config.book.recommend_books+"/"+book+"/recommend";
		wx.request({
			url: url,
			success: function(res){
				that.setData({
					related_books: res.data.books,
					get_data_flag: that.data.get_data_flag+1
				});
				if(that.data.get_data_flag == 4) wx.hideLoading();
				// console.log(that.data.related_books);
			},
			fail: function(){
				wx.hideLoading();
				wx.showModal({
					title: "网络错误，请稍后再试"
				});
			}
		});
	},
	getBookReviews: function(book){
		var that = this;
		var url = app.globalData.config.comment.book_reviews+"?book="+book+"&sort=comment-count&start=0&limit=10";
		wx.request({
			url: url,
			success: function(res){
				that.setData({
					book_reviews: res.data.reviews,
					get_data_flag: that.data.get_data_flag+1
				});
				if(that.data.get_data_flag == 4) wx.hideLoading();
				// console.log(that.data.book_reviews);
			},
			fail: function(){
				wx.hideLoading();
				wx.showModal({
					title: "网络错误，请稍后再试"
				});
			}
		});
	},
	getMyBooks: function(){
		var book_id = this.data.book_info._id;
		var mybooks = wx.getStorageSync("mybooks");
		mybooks = mybooks?mybooks:new Array();
		this.setData({
			mybooks: mybooks,
			get_data_flag: this.data.get_data_flag+1
		});
		if(this.data.get_data_flag == 4) wx.hideLoading();
		if(this.isInMybooks(this.data.mybooks,book_id) != -1){
			var index = this.isInMybooks(this.data.mybooks,book_id);
			var source_id = this.data.mybooks[index].source_id;
			var source_index = this.indexOfSource(this.data.book_source_info, source_id);
			// console.log(source_index,);
			this.setData({
				index: source_index,
				source_id: source_id,
				add_book_stat: "已加入",
				add_to_mybooks_style: "added",
				add_fun: "removeBook"
			});
		}
	},
	changeSource: function(event){
		var index = event.detail.value;
		this.setData({
			index: index,
			source_id: this.data.book_source_info[index]._id
		});
	},
	addToMybooks: function(event){
		if(this.data.source_id == "") {
			wx.showToast({
				title: "请先选择书源",
				icon: "none"
			});
		}else{
			var mybooks = this.data.mybooks;
			var need_add_book = {
				book_id: this.data.book_info._id,
				source_id: this.data.source_id,
				reading_chapter: 0,
				reading_process: 0
			};
			
			if(this.isInMybooks(mybooks,need_add_book.book_id) == -1){
				mybooks.push(need_add_book);
				try{
    				wx.setStorageSync('mybooks', mybooks);
				}catch(e){
					wx.showToast({
						title: "未知错误，稍后再试",
						icon: "none"
					});
				}
				this.setData({
					mybooks: mybooks,
					add_book_stat: "已加入",
					add_to_mybooks_style: "added",
					add_fun: "removeBook"
				});
				wx.showToast({
					title: "已添加至书架",
					icon: "success"
				});
			}
		}
	},
	removeBook: function(event){
		wx.showToast({
			title: '请前往"书架"移除',
			icon: "none"
		});
		// var that = this;
		// wx.showModal({
		//   title: '是否移出书架？',
		//   content: '将会删除该书的阅读记录',
		//   success: function(res) {
		//     if(res.confirm){
		//       	var book_id = that.data.book_info._id;
		// 		try {
		// 	      var mybooks = wx.getStorageSync("mybooks");
		// 	    } catch (e) {
		// 	      wx.showToast({
		// 	        title: "未知错误，稍后再试",
		// 	        icon: "none"
		// 	      });
		// 	    }
		// 		var index = that.isInMybooks(mybooks, book_id);
		// 		mybooks.splice(index, 1);
		// 		try{
		// 			wx.setStorageSync('mybooks', mybooks);
		// 		}catch(e){
		// 			wx.showToast({
		// 				title: "未知错误，稍后再试",
		// 				icon: "none"
		// 			});
		// 		}
		// 		that.setData({
		// 			mybooks: mybooks,
		// 			add_book_stat: "加入书架",
		// 			add_to_mybooks_style: "add_to_mybooks",
		// 			add_fun: "addToMybooks"
		// 		});
		// 		wx.showToast({
		// 			title: "已从书架移除",
		// 			icon: "none"
		// 		});
		//     }else if(res.cancel){
		      
		//     }
		//   }
		// });
	},
	startRead: function(event){
		if(this.data.source_id == "") {
			wx.showToast({
				title: "请先选择书源",
				icon: "none"
			});
		}else{
			wx.navigateTo({
				url: "/pages/read/read?source_id="+this.data.source_id+"&book_id="+this.data.book_info._id
			});
		}
	},
	isInMybooks: function(arr,value){
		var len = arr.length;
	    for(var i = 0; i < len; i++){
	        if(value === arr[i].book_id){
	            return i;
	        }
	    }
	    return -1;
	},
	indexOfSource: function(arr, value){
		var len = arr.length;
	    for(var i = 0; i < len; i++){
	        if(value === arr[i]._id){
	            return i;
	        }
	    }
	    return -1;
	}
})
