import BaseRequest from './BaseRequest.js';

var app = getApp();

class SearchRequest extends BaseRequest {

  /**
   * 获取搜索书籍
   */
  getSearchBooks(keyword, page, user, success, fail) {
    this.get(
      app.globalData.config.book.book_search + "?keyword=" + keyword + "&page=" + page + "&limit=20&where=search",
      user, success, fail
    );
  }

}

export default SearchRequest;