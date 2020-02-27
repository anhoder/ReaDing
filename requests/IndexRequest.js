import BaseRequest from './BaseRequest.js';

var app = getApp();

class IndexRequest extends BaseRequest {

  /**
   * 获取Token
   */
  getToken(success, fail) {
    this.post(
      app.globalData.config.user.token.concat("?version=1&vercode=1&brand=apple&device=iPhone11,6&serial=13.3.1"),
      [],
      {},
      success, fail
    );
  }

  /**
   * 获取Banner
   */
  getBanner(user, success, fail) {
    this.get(
      app.globalData.config.book_list.banner.concat("?sex=0"),
      user, success, fail
    );
  }
  
  /**
   * 获取随机书籍
   */
  getRandomBooks(maleType, user, success, fail) {
    this.get(
      app.globalData.config.book_list.random.concat("?sex=", maleType, "&category=choice"),
      user, success, fail
    );
  }

  /**
   * 获取热词
   */
  getHotWords(user, success, fail) {
    this.get(
      app.globalData.config.book.hotword,
      user, success, fail
    );
  }

  /**
   * 自动补全
   */
  getAutoComplete(word, user, success, fail) {
    this.get(
      app.globalData.config.book.book_autocomplete + "?keyword=" + word,
      user, success, fail
    );
  }
}

export default IndexRequest;