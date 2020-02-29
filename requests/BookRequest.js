import BaseRequest from './BaseRequest.js';

var app = getApp();

class BookRequest extends BaseRequest {

  /**
   * 获取小说信息
   */
  getBookInfo(bookId, user, success) {
    this.get(
      app.globalData.config.book.book_info + "?book_id=" + bookId,
      user, success
    );
  }

}

export default BookRequest;