import BaseRequest from './BaseRequest.js';

var app = getApp();

class ReadRequest extends BaseRequest {

  /**
   * 获取章节列表
   */
  getChapters(booId, sourceId, user, success) {
    this.get(
      app.globalData.config.book.book_chapters + "?book_id=" + booId + "&site_id=" + sourceId,
      user, success
    );
  }

  /**
   * 获取章节内容
   */
  getChapterContent(chapterId, sourceBookId, listsId, sourceId, user, success) {
    this.get(
      app.globalData.config.book.chapter_content + "?chapter_id=" + chapterId + "&crawl_book_id=" + sourceBookId + "&id=" + listsId + "&site_id=" + sourceId, 
      user, success
    );
  }

  /**
   * 获取资源列表
   */
  getSources(bookId, user, success) {
    this.get(
      app.globalData.config.book.book_sources + "?book_id=" + bookId,
      user, success
    );
  }
}

export default ReadRequest;