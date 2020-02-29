import BaseRequest from './BaseRequest.js';

var app = getApp();

class IndexRequest extends BaseRequest {

  /**
   * 获取Token
   */
  getToken(success) {
    this.post(
      app.globalData.config.user.token.concat("?version=1&vercode=1&brand=apple&device=iPhone11,6&serial=13.3.1"),
      [], {}, success
    );
  }

  /**
   * 获取Banner
   */
  getBanner(user, success) {
    this.get(
      app.globalData.config.book_list.banner.concat("?sex=0"),
      user, success
    );
  }
  
  /**
   * 获取随机书籍
   */
  getRandomBooks(maleType, user, success) {
    this.get(
      app.globalData.config.book_list.random.concat("?sex=", maleType, "&category=choice"),
      user, success
    );
  }

  /**
   * 获取热词
   */
  getHotWords(user, success) {
    this.get(
      app.globalData.config.book.hotword,
      user, success
    );
  }

  /**
   * 自动补全
   */
  getAutoComplete(word, user, success) {
    this.get(
      app.globalData.config.book.book_autocomplete + "?keyword=" + word,
      user, success
    );
  }
}

export default IndexRequest;