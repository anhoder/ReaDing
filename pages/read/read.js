/*
* @File:   read.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-22 08:48:49
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-25 18:22:16
* @Comment:
*/
var app = getApp();
Page({
	data:{
		source_id: "",
		book_id: "",
		mybooks: new Array(),
		book_chapters: {},
		reading_chapter: 0,
		reading_process: 0,
		start_reading_process:0,
		chapter_title: "",
		chapter_content: {},
		opacity: 0,
		cover_style: "cover_hide",
		chapters_style: "chapters_hide",
		to_reading_chapter: 0,
		book_source_info: new Array(),
		index_source: 0,
		button_select: {
			0: 1,
			1: 0,
			2: 0
		},
		font_size: 2,
		line_height: 1
	},
	onLoad: function(opt){
		this.loading(opt.book_id, opt.source_id);
	},
	loading: function(book_id, source_id){
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});

		this.setData({
			source_id: source_id,
			book_id: book_id
		});
		this.getBookChapters(source_id);
		this.getBookSource(book_id);
		this.getStyleStorage();
	},
	getBookChapters: function(source_id){
		var that = this;
		var url = app.globalData.config.book.book_chapters+"/"+source_id+"?view=chapters";
		wx.request({
			url: url,
			success: function(res){
				var reading_chapter = that.getReadingChapter();
				that.setData({
					book_chapters: res.data,
					chapter_title: res.data.chapters[reading_chapter].title
				});
				// console.log(that.data.book_chapters);
				wx.setNavigationBarTitle({  
			      	title: res.data.chapters[reading_chapter].title
			    });
				if(that.data.book_chapters.chapters[reading_chapter].isVip){
					that.setData({
						chapter_content: {
							body: "该章节需要会员"
						},
						opacity: 1
					});
					wx.hideLoading();
				}else{
					var chapter_link = that.data.book_chapters.chapters[reading_chapter].link;
					that.getChapterContent(chapter_link);
				}
			},
			fail: function(){
				wx.hideLoading();
				wx.showModal({
					title: "网络错误，请稍后再试"
				});
			}
		});
	},
	getReadingChapter: function(){
		var book_id = this.data.book_id;
		var mybooks = wx.getStorageSync("mybooks");
		var index = this.isInMybooks(mybooks, book_id);
		var chapter_index = 0;
		var reading_process = 0;
		if(index != -1) {
			chapter_index = mybooks[index].reading_chapter;
			reading_process = mybooks[index].reading_process;
		}
		this.setData({
			mybooks: mybooks,
			reading_chapter: chapter_index,
			reading_process: reading_process
		});
		return chapter_index;
	},
	getChapterContent: function(chapter_link){
		var that = this;
		var url = app.globalData.config.book.chapter_content+"/"+escape(chapter_link);
		// console.log(url);
		wx.request({
			url: url,
			success: function(res){
				that.setData({
					chapter_content: res.data.chapter,
					opacity: 1
				});
				// console.log(that.data.chapter_content);

				// console.log(res.data.chapter);
				wx.hideLoading();
				if(that.data.reading_process){
					wx.showModal({
						title: "跳转到上次阅读的位置？",
						success: function(res){
							if(res.confirm){
								that.setData({
									start_reading_process: that.data.reading_process
								});
							}else if(res.cancel){
								that.setData({
									reading_process: 0
								});
							}
						}
					});
				}
				
			},
			fail: function(){
				wx.hideLoading();
				wx.showModal({
					title: "网络错误，请稍后再试"
				});
			}
		});
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
	setReadingProcess: function(event){
		this.setData({
			reading_process: event.detail.scrollTop
		});
	},
	onHide: function(){
		var mybooks = this.data.mybooks;
		var index = this.isInMybooks(mybooks,this.data.book_id);

		if(index != -1){
			mybooks[index].reading_process = this.data.reading_process;
			mybooks[index].reading_chapter = this.data.reading_chapter;
			try{
				wx.setStorageSync('mybooks', mybooks);
			}catch(e){
				wx.showToast({
					title: "未知错误，稍后再试",
					icon: "none"
				});
			}
		}
	},
	onUnload: function(){
		var mybooks = this.data.mybooks;
		var index = this.isInMybooks(mybooks,this.data.book_id);

		if(index != -1){
			mybooks[index].reading_process = this.data.reading_process;
			mybooks[index].reading_chapter = this.data.reading_chapter;
			try{
				wx.setStorageSync('mybooks', mybooks);
			}catch(e){
				wx.showToast({
					title: "未知错误，稍后再试",
					icon: "none"
				});
			}
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
	setPreButtonDisabled: function(){
		wx.showToast({
			title: "已经是第一章",
			icon: "none"
		});
	},
	setNextButtonDisabled: function(){
		wx.showToast({
			title: "已经是最后一章",
			icon: "none"
		});
	},
	toPreChapter: function(){
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});
		var reading_chapter = this.data.reading_chapter-1;
		this.toChapter(reading_chapter);
	},
	toNextChapter: function(){
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});
		var reading_chapter = this.data.reading_chapter+1;
		this.toChapter(reading_chapter);
	},
	toChapter: function(reading_chapter){
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});
		var title = this.data.book_chapters.chapters[reading_chapter].title;
		this.setData({
			reading_chapter: reading_chapter,
			reading_process: 0,
			start_reading_process: 0,
			chapter_title: title
		});
		wx.setNavigationBarTitle({  
			title: title
		});

		if(this.data.book_chapters.chapters[reading_chapter].isVip){
			this.setData({
				chapter_content: {
					body: "该章节需要会员"
				}
			});
			wx.hideLoading();
		}else{
			var chapter_link = this.data.book_chapters.chapters[reading_chapter].link;
			this.getChapterContent(chapter_link);
		}
	},
	changeCover: function(){
		var cover_style = this.data.cover_style;
		var chapters_style = this.data.chapters_style;
		if(chapters_style == "chapters_show") chapters_style="chapters_hide";
		else if(cover_style == "cover_hide") cover_style = "cover_show";
		else cover_style = "cover_hide";
		
		this.setData({
			cover_style: cover_style,
			chapters_style: chapters_style
		});
	},
	toBookInfo: function(){
		wx.navigateTo({
			url: "/pages/bookinfo/bookinfo?book="+this.data.book_id
		});
	},
	toObjChapter: function(event){
		var chapter_index = event.currentTarget.dataset.index;
		this.toChapter(chapter_index);
	},
	showChapters: function(){
		var to_reading_chapter = this.data.reading_chapter;
		this.setData({
			chapters_style: "chapters_show",
			to_reading_chapter: to_reading_chapter,
			cover_style: "cover_hide"
		});
	},
	getBookSource: function(book_id){
		var that = this;
		var url = app.globalData.config.book.book_sources+"?view=summary&book="+book_id;
		wx.request({
			url: url,
			success: function(res){
				var index_source = that.indexOfSource(res.data, that.data.source_id);
				that.setData({
					book_source_info: res.data,
					index_source: index_source
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
	indexOfSource: function(arr, value){
		var len = arr.length;
	    for(var i = 0; i < len; i++){
	        if(value === arr[i]._id){
	            return i;
	        }
	    }
	    return -1;
	},
	changeSource: function(event){
		var that = this;
		var source_index = event.detail.value;
		wx.showModal({
			title: "确认换源？",
			content: "可能造成阅读记录发生偏差",
			success: function(res){
				if (res.confirm) {
				  // console.log(that.data.book_source_info[source_index]._id);
			      that.setData({
			      	source_id: that.data.book_source_info[source_index]._id,
			      	index_source: source_index
			      });
			      var mybooks = that.data.mybooks;
				  var index = that.isInMybooks(mybooks,that.data.book_id);
 
				  if(index != -1){
					mybooks[index].reading_chapter = that.data.reading_chapter;
					mybooks[index].source_id = that.data.source_id;
					try{
					  wx.setStorageSync('mybooks', mybooks);
					}catch(e){
					  wx.showToast({
					    title: "未知错误，稍后再试",
					  	icon: "none"
					  });
					}
				  }
				  wx.redirectTo({
				  	url: "/pages/read/read?source_id="+that.data.source_id+"&book_id="+that.data.book_id
				  });
			    } else if (res.cancel) {
			      that.setData({
			      	index_source: that.data.index_source
			      });
			    }
			}
		});
	},
	changeStyle: function(event){
		var style_id = event.target.dataset.id;
		var button_select = {
			0: 1,
			1: 0,
			2: 0
		}
		if(style_id == 1){
			button_select = {
				0: 0,
				1: 1,
				2: 0
			}
		}else if(style_id == 2){
			button_select = {
				0: 0,
				1: 0,
				2: 1
			}
		}
		this.setData({
			button_select: button_select
		});
		this.setStyleStorage();
	},
	font_size_sub: function(){
		this.setData({
			font_size: this.data.font_size-1
		});
		this.setStyleStorage();
	},
	font_size_add: function(){
		this.setData({
			font_size: this.data.font_size+1
		});
		this.setStyleStorage();
	},
	line_height_sub: function(){
		this.setData({
			line_height: this.data.line_height-1
		});
		this.setStyleStorage();
	},
	line_height_add: function(){
		this.setData({
			line_height: this.data.line_height+1
		});
		this.setStyleStorage();
	},
	getStyleStorage:function(){
		var style = wx.getStorageSync("style");
		if(style){
			this.setData({
				button_select: style.button_select,
				font_size: style.font_size,
				line_height: style.line_height
			});
		}
	},
	setStyleStorage: function(){
		var style = {
			button_select: this.data.button_select,
			font_size: this.data.font_size,
			line_height: this.data.line_height
		};
		try {
		    wx.setStorageSync('style', style);
		} catch(e){  
			wx.showToast({
			    title: "未知错误，稍后再试",
			  	icon: "none"
			});
		}
	},
	none: function(){

	}
})