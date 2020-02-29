import BaseRequest from './BaseRequest.js';

var app = getApp();

class SearchRequest extends BaseRequest {

  /**
   * 获取搜索书籍
   */
  getSearchBooks(keyword, page, user, success) {
    this.get(
      app.globalData.config.book.book_search + `?limit=20&where=search&keyword=${keyword}&page=${page}`,
      user, success
    );
  }

}

export default SearchRequest;