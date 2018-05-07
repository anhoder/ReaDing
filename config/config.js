/*
* @File:   config.js
* @Author: Alan_Albert
* @Email:  1766447919@qq.com
* @Date:   2018-02-16 23:34:40
* @Last Modified by:   Alan_Albert
* @Last Modified time: 2018-02-17 09:46:59
* @Comment:
*/
var config = {
  "category": {
    "categories": "https:\/\/api.zhuishushenqi.com\/cats\/lv2\/statistics",
    "sub_categories": "https:\/\/api.zhuishushenqi.com\/cats\/lv2",
    "category_info": "https:\/\/api.zhuishushenqi.com\/book\/by-categories"
  },
  "book": {
    "book_info": "https:\/\/api.zhuishushenqi.com\/book",
    "recommend_books": "https:\/\/api.zhuishushenqi.com\/book",
    "author_books": "https:\/\/api.zhuishushenqi.com\/book\/accurate-search",
    "book_sources": "https:\/\/api.zhuishushenqi.com\/atoc",
    "book_chapters": "https:\/\/api.zhuishushenqi.com\/atoc",
    "chapter_content": "https:\/\/chapter2.zhuishushenqi.com\/chapter",
    "book_search": "https:\/\/api.zhuishushenqi.com\/book\/fuzzy-search",
    "book_autocomplete": "https:\/\/api.zhuishushenqi.com\/book\/auto-complete"
  },
  "rank": {
    "rank_categories": "https:\/\/api.zhuishushenqi.com\/ranking\/gender",
    "rank_info": "https:\/\/api.zhuishushenqi.com\/ranking"
  },
  "comment": {
    "discussions": "https:\/\/api.zhuishushenqi.com\/post\/by-book",
    "short_reviews": "https:\/\/api.zhuishushenqi.com\/post\/short-review",
    "book_reviews": "https:\/\/api.zhuishushenqi.com\/post\/review\/by-book"
  },
  "book_list": {
    "lists": "https:\/\/api.zhuishushenqi.com\/book-list",
    "detail": "https:\/\/api.zhuishushenqi.com\/book-list"
  }
};
module.exports.config = config;
