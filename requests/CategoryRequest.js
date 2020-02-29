import BaseRequest from './BaseRequest.js';

var app = getApp();

class CategoryRequest extends BaseRequest {

  /**
   * 获取分类列表
   */
  getCategories(sex, user, success) {
    this.get(
      app.globalData.config.category.categories + `?sex=${sex}`,
      user, success
    );
  }

  /**
   * 获取分类详情
   */
  getCategoryInfo(sex, ltype, stype, page, user, success) {
    let url = app.globalData.config.category.category_info + `?sex=${sex}`;
    if (ltype >= 0) {
      url += `&ltype=${ltype}`;
    }
    if (stype >= 0) {
      url += `&stype=${stype}`;
    }
    this.get(
      url + `&page=${page}&limit=10`,
      user, success
    );
  }

}

export default CategoryRequest;