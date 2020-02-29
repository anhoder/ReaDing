/*
* @File:   bookinfo.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-19 22:18:08
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-24 09:26:52
* @Comment:
*/
import BookRequest from '../../requests/BookRequest.js';

var bookRequest = new BookRequest();
var app = getApp();

Page({
	data:{
		book_info: {},
		book_source_info: [], // 书源
		author_books: [],   // 作者其他书籍
		book_reviews: {},   // 评论
		// select_source_tips: "选择书源",
		index: -1,
		source_id: "",
		mybooks: [],
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
    var bookId = opt.book;

    var userInfo = wx.getStorageSync('user');
    this.setData({token: userInfo.token, userId: userInfo.userId});

    bookRequest.getBookInfo(bookId, userInfo, res => {
      that.setData({
        book_info: res.data.data,
        book_source_info: res.data.data.sites,
        author_books: res.data.data.author_book_list,
        book_reviews: res.data.data.comment_info_list,
        get_data_flag: that.data.get_data_flag + 1
      });
      this.getMyBooks();
      if(this.data.get_data_flag == 2) wx.hideLoading();
    });
	},


  /**
   * 获取本地书架信息
   */
	getMyBooks: function(){
		var book_id = this.data.book_info.book_id;
		var mybooks = wx.getStorageSync("mybooks");
		mybooks = mybooks ? mybooks : [];
		this.setData({
			mybooks: mybooks,
			get_data_flag: this.data.get_data_flag+1
		});
		if(this.data.get_data_flag == 2) wx.hideLoading();
		if(this.isInMybooks(mybooks,book_id) != -1){
			var index = this.isInMybooks(mybooks, book_id);
			var source_id = this.data.mybooks[index].source_id;
			var source_index = this.indexOfSource(this.data.book_source_info, source_id);
			this.setData({
				index: source_index,
				source_id: source_id,
				add_book_stat: "已加入",
				add_to_mybooks_style: "added",
				add_fun: "removeBook"
			});
		}
	},


  /**
   * 改变书源
   */
	changeSource: function(event){
		var index = event.detail.value;
		this.setData({
			index: index,
      source_id: this.data.book_source_info[index].site
		});
	},


  /**
   * 添加到书架
   */
	addToMybooks: function(event){
		if(this.data.source_id == "") {
			wx.showToast({
				title: "请先选择书源",
				icon: "none"
			});
		}else{
			var mybooks = this.data.mybooks;
			var need_add_book = {
				book_id: this.data.book_info.book_id,
				source_id: this.data.source_id,
        book_info: {
          name: this.data.book_info.name,
          image: this.data.book_info.image,
          author: this.data.book_info.author,
          ltype: this.data.book_info.ltype,
          stype: this.data.book_info.stype,
          remark: this.data.book_info.remark,
          last_chapter: this.data.book_info.last_chapter
        },
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


  /**
   * 移出书架
   */
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


  /**
   * 开始阅读
   */
	startRead: function(event){
		if(this.data.source_id == "") {
			wx.showToast({
				title: "请先选择书源",
				icon: "none"
			});
		}else{
			wx.navigateTo({
				url: "/pages/read/read?source_id="+this.data.source_id+"&book_id="+this.data.book_info.book_id
			});
		}
	},


  /**
   * 是否在我的书架
   */
	isInMybooks: function(arr,value){
		var len = arr.length;
	    for(var i = 0; i < len; i++){
	        if(value === arr[i].book_id){
	            return i;
	        }
	    }
	    return -1;
	},


  /**
   * 获取资源index
   */
	indexOfSource: function(arr, value){
		var len = arr.length;
	    for(var i = 0; i < len; i++){
        if (value === arr[i].site){
            return i;
        }
	    }
	    return -1;
	}
})
