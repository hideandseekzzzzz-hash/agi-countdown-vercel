/**
 * 简单的内存缓存工具
 * 用于Vercel Serverless Functions
 */

class SimpleCache {
  constructor(defaultTTL = 300000) { // 默认5分钟
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {any} value - 缓存值
   * @param {number} ttl - 过期时间（毫秒）
   */
  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl
    });
  }

  /**
   * 获取缓存
   * @param {string} key - 缓存键
   * @returns {any|null} - 缓存值或null
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * 删除缓存
   * @param {string} key - 缓存键
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * 清空所有缓存
   */
  clear() {
    this.cache.clear();
  }

  /**
   * 清理过期缓存
   */
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

// 导出缓存实例
const metricsCache = new SimpleCache(300000); // 5分钟
const newsCache = new SimpleCache(1800000); // 30分钟

module.exports = {
  SimpleCache,
  metricsCache,
  newsCache
};
