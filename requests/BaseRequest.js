class BaseRequest {

  /**
   * 获取头部
   */
  getHeader(user) {
    if (!user) return {
      ver: "5.0",
      pt: "ios",
      packge: "quanminxiaoshuo",
    };
    return {
      ver: "5.0",
      pt: "ios",
      packge: "quanminxiaoshuo",
      token: user.token,
      user: user.userId
    };
  };


  /**
   * GET请求
   */
  get(url, user, success, fail) {
    var that = this;
    wx.request({
      url,
      header: that.getHeader(user),
      success,
      fail
    });
  }

  /**
   * POST请求
   */
  post(url, data, user, success, fail) {
    var that = this;
    wx.request({
      url,
      data,
      header: that.getHeader(user),
      method: 'POST',
      success,
      fail
    });
  }
};

export default BaseRequest;