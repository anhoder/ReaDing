/*
* @File:   mybooks.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-23 19:03:11
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-25 19:07:09
* @Comment:
*/
import BookRequest from '../../requests/BookRequest.js';

var app = getApp();
var bookRequest = new BookRequest();

Page({

  data: {
    no_book_tips: "",
    mybooks: [],
    bookWidth: 150,
    startX: 0,
    remove_index: -1,
    left: "0rpx",
    user: {}
  },

  onLoad: function () {
    wx.showLoading({
      "title": "加载中...",
      "duration": 20000
    });
    var user = wx.getStorageSync('user');
    var mybooks = wx.getStorageSync('mybooks');
    if (mybooks.length > 0)
      this.setData({ user, mybooks });
    else 
      this.setData({ no_book_tips: "去添加一本书吧~", mybooks: [], user});
    wx.hideLoading();
  },


  onShow: function(){
    var mybooks = wx.getStorageSync('mybooks');
    if (mybooks.length != this.data.mybooks.length) {
      this.resetData();
      this.setData({ mybooks: mybooks ? mybooks : [] });
    }
  },


  /**
   * 获取书籍信息
   */
  getBookInfo: function(book_id, source_id){
    var that = this;
    bookRequest.getBookInfo(book_id, this.data.user, res => {
      var books_info = that.data.books_info;
      var book_info = res.data.data;
      book_info.source_id = source_id;
      books_info.push(book_info);
      that.setData({
        books_info: books_info
      });
      wx.hideLoading();
    });
  },


  touchS:function(e){
    // console.log(e);
    //判断是否只有一个触摸点
    if(e.touches.length==1){
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },


  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM:function(e){
    // console.log(e);
    var that = this;
    if(e.touches.length==1){
     //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      var moveY = e.touches[0].clientY;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      var disY = that.data.startY - moveY;
     //bookWidth 为右侧按钮区域的宽度
      var bookWidth = that.data.bookWidth;
      var left = "";
      if(disX == 0 || disX < 0 || disX < disY){//如果移动距离小于等于0，文本层位置不变
        left = "0rpx";
      }else if(disX > 0 ){//移动距离大于0，文本层left值等于手指移动距离
        left = "-"+disX+"rpx";
        if(disX >= bookWidth){
          //控制手指移动距离最大值为删除按钮的宽度
          left = "-"+bookWidth+"rpx";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      this.setData({
        remove_index: index,
        left: left
      });
    }
  },


  touchE:function(e){
    // console.log(e);
    var that = this
    if(e.changedTouches.length==1){
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var bookWidth = that.data.bookWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > bookWidth/2 ? "-"+bookWidth+"rpx":"0rpx";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      this.setData({
        remove_index: index,
        left: left
      });
    }
  },


  /**
   * 移除书籍
   */
  removeBook: function(event){
    var that = this;
    wx.showModal({
      title: '是否移出书架？',
      content: '将会删除该书的阅读记录',
      success: function(res) {
        if(res.confirm){
          var book_id = event.target.dataset.book;
          try {
            var mybooks = wx.getStorageSync("mybooks");
          } catch (e) {
            wx.showToast({
              title: "未知错误，稍后再试",
              icon: "none"
            });
          }
          var index = that.isInMybooks(mybooks, book_id);
          mybooks.splice(index, 1);
          try{
            wx.setStorageSync('mybooks', mybooks);
          }catch(e){
            wx.showToast({
              title: "未知错误，稍后再试",
              icon: "none"
            });
          }
          that.setData({
            mybooks: mybooks,
            no_book_tips: mybooks.length > 0 ? "去添加一本书吧~" : '',
            add_book_stat: "加入书架",
            add_to_mybooks_style: "add_to_mybooks",
            add_fun: "addToMybooks"
          });
          wx.showToast({
            title: "已从书架移除",
            icon: "none"
          });
        }else if(res.cancel){
          
        }
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


  resetData: function(){
    this.setData({
      no_book_tips: "",
      mybooks: [],
      books_info: [],
      bookWidth: 150,
      startX: 0,
      remove_index: -1,
      left: "0rpx"
    });
  }

})