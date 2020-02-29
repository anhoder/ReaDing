import BaseRequest from './BaseRequest.js';

var app = getApp();

class RankRequest extends BaseRequest {

  /**
   * 获取排行榜列表
   */
  getRanks(sex, user, success) {
    this.get(
      app.globalData.config.rank.rank_categories + "?sex=" + sex,
      user, success
    );
  }


  /**
   * 获取排行榜详情
   */
  getRankInfo(type, subType, page, user, success) {
    this.get(
      app.globalData.config.rank.rank_info + `?sub_type=${subType}&type=${type}&limit=10&page=${page}`,
      user, success
    );
  }

}

export default RankRequest;