/*
* @File:   read.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-22 08:48:49
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-25 18:22:16
* @Comment:
*/
import ReadRequest from '../../requests/ReadRequest.js';

var app = getApp();
var readRequest = new ReadRequest();

Page({
	data:{
		source_id: "",
		book_id: "",
		mybooks: new Array(),
		book_chapters: [],
		reading_chapter: 0,
		reading_process: 0,
		start_reading_process:0,
		chapter_title: "",
		chapter_content: "",
		opacity: 0,
		cover_style: "cover_hide",
		chapters_style: "chapters_hide",
		to_reading_chapter: 0,
		book_source_info: [],
    book_source_name: [],
		index_source: 0,
		button_select: {
			0: 1,
			1: 0,
			2: 0
		},
		font_size: 2,
		line_height: 1,
    user: {}
	},


	onLoad: function(opt){
    var user = wx.getStorageSync('user');
    this.setData({user});
		this.loading(opt.book_id, opt.source_id);
	},

  
  /**
   * 加载中
   */
  loading: function (bookId, sourceId){
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});

		this.setData({
      source_id: sourceId,
      book_id: bookId
		});
		this.getBookChapters(bookId, sourceId);
		this.getBookSource(bookId);
		this.getStyleStorage();
	},


  /**
   * 获取书籍章节
   */
	getBookChapters: function(bookId, sourceId){
		var that = this;
		readRequest.getChapters(bookId, sourceId, this.data.user, res => {
				var reading_chapter = that.getReadingChapter();
				that.setData({
					book_chapters: res.data.data,
					chapter_title: res.data.data[reading_chapter].name
				});
				wx.setNavigationBarTitle({  
          title: res.data.data[reading_chapter].name
        });
      	that.getChapterContent(
          that.data.book_chapters[reading_chapter].chapter_id,
          that.data.book_chapters[reading_chapter].crawl_book_id,
          that.data.book_chapters[reading_chapter].lists_id,
          sourceId
        );
      }
    );
	},


  /**
   * 获取正在阅读的章节
   */
	getReadingChapter: function () {
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


  /**
   * 获取章节内容
   */
	getChapterContent: function(chapterId, sourceBookId, listsId, sourceId){
		var that = this;
		readRequest.getChapterContent(chapterId, sourceBookId, listsId, sourceId, this.data.user, res => {
        
        that.setData({
          chapter_content: res.data.data.content,
          opacity: 1
        });
        wx.hideLoading();
        if (that.data.reading_process) {
          wx.showModal({
            title: "跳转到上次阅读的位置？",
            success: res => {
              if (res.confirm) {
                that.setData({
                  start_reading_process: that.data.reading_process
                });
              } else if (res.cancel) {
                that.setData({
                  reading_process: 0
                });
              }
            }
          });
        }
      }
    );
	},


  /**
   * 是否在我的书架
   */
	isInMybooks: function(arr,value){
		var len = arr.length;
	    for(var i = 0; i < len; i++){
	        if(value == arr[i].book_id){
	            return i;
	        }
	    }
	    return -1;
	},


  /**
   * 设置阅读进度
   */
	setReadingProcess: function(event){
		this.setData({
			reading_process: event.detail.scrollTop
		});
	},


  /**
   * 小程序隐藏回调
   */
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

  
  /**
   * 回调
   */
  onUnload: function(){
		var mybooks = this.data.mybooks;
		var index = this.isInMybooks(mybooks,this.data.book_id);
    
    if (index != -1) {
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


  /**
   * disable上一章
   */
	setPreButtonDisabled: function(){
		wx.showToast({
			title: "已经是第一章",
			icon: "none"
		});
	},


  /**
   * disable下一章
   */
	setNextButtonDisabled: function(){
		wx.showToast({
			title: "已经是最后一章",
			icon: "none"
		});
	},


  /**
   * 跳转到前一章
   */
	toPreChapter: function(){
		var reading_chapter = this.data.reading_chapter-1;
		this.toChapter(reading_chapter);
	},


  /**
   * 跳转到后一章
   */
	toNextChapter: function(){
		var reading_chapter = this.data.reading_chapter+1;
		this.toChapter(reading_chapter);
	},


  /**
   * 跳转章节
   */
	toChapter: function(reading_chapter){
		wx.showLoading({
			"title": "加载中...",
			"duration": 20000
		});
		var title = this.data.book_chapters[reading_chapter].name;
		this.setData({
			reading_chapter: reading_chapter,
			reading_process: 0,
			start_reading_process: 0,
			chapter_title: title
		});
		wx.setNavigationBarTitle({  
			title: title
		});

    this.getChapterContent(
      this.data.book_chapters[reading_chapter].chapter_id,
      this.data.book_chapters[reading_chapter].crawl_book_id,
      this.data.book_chapters[reading_chapter].lists_id,
      this.data.source_id
    );
	},


  /**
   * 改变蒙层
   */
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


  /**
   * 跳转到书籍详情
   */
	toBookInfo: function(){
		wx.navigateTo({
			url: "/pages/bookinfo/bookinfo?book="+this.data.book_id
		});
	},


  /**
   * 跳转到目标章节
   */
	toObjChapter: function(event) {
		var chapter_index = event.currentTarget.dataset.index;
		this.toChapter(chapter_index);
	},


  /**
   * 显示章节信息
   */
	showChapters: function(){
		var to_reading_chapter = this.data.reading_chapter;
		this.setData({
			chapters_style: "chapters_show",
			to_reading_chapter: to_reading_chapter,
			cover_style: "cover_hide"
		});
	},


  /**
   * 获取书源信息
   */
	getBookSource: function(book_id){
		var that = this;
    readRequest.getSources(book_id, this.data.user, res => {
				var index_source = that.indexOfSource(res.data, that.data.source_id);
				that.setData({
					book_source_info: res.data.data,
          book_source_name: res.data.data.map(item => item.site_name),
					index_source: index_source
				});
      }
    );
	},


  /**
   * 获取资源index
   */
	indexOfSource: function(arr, value){
		var len = arr.length;
	    for(var i = 0; i < len; i++){
	        if(value === arr[i].site){
	            return i;
	        }
	    }
	    return -1;
	},


  /**
   * 修改书源
   */
	changeSource: function(event){
		var that = this;
		var source_index = event.detail.value;
		wx.showModal({
			title: "确认换源？",
			content: "可能造成阅读记录发生偏差",
			success: function(res){
				if (res.confirm) {
          that.setData({
            source_id: that.data.book_source_info[source_index].site,
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


  /**
   * 改变样式
   */
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


  /**
   * 减小字体
   */
	font_size_sub: function(){
		this.setData({
			font_size: this.data.font_size-1
		});
		this.setStyleStorage();
	},


  /**
   * 增大字体
   */
	font_size_add: function(){
		this.setData({
			font_size: this.data.font_size+1
		});
		this.setStyleStorage();
	},


  /**
   * 减小行高
   */
	line_height_sub: function(){
		this.setData({
			line_height: this.data.line_height-1
		});
		this.setStyleStorage();
	},


  /**
   * 增大行高
   */
	line_height_add: function(){
		this.setData({
			line_height: this.data.line_height+1
		});
		this.setStyleStorage();
	},


  /**
   * 获取本地样式
   */
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


  /**
   * 保存样式到本地
   */
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