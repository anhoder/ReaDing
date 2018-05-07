/*
* @File:   authorbooks.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-21 14:54:27
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-24 23:16:20
* @Comment:
*/
var app = getApp();

Page({

  data: {
    author: "",
    author_books: {}
  },

  onLoad: function (opt) {
    wx.showLoading({
      "title": "加载中...",
      "duration": 20000
    });
    // console.log(opt);
    this.setData({
      author: opt.author
    });
    wx.setNavigationBarTitle({
      title: this.data.author
    });
    this.getAuthorBooks();
  },
  getAuthorBooks: function(){
    var that = this;
    var author = encodeURI(this.data.author);
    var url = app.globalData.config.book.author_books+"?author="+author;
    wx.request({
      url: url,
      success: function(res){
        that.setData({
          author_books: res.data.books
        });
        // console.log(that.data.author_books);
        wx.hideLoading();
      },
      fail: function(){
        wx.hideLoading();
        wx.showModal({
          title: "网络错误，请稍后再试~"
        });
      }
    });
  }
})
