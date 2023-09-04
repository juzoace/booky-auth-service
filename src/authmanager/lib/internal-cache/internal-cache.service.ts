import {  Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InternalCacheStore } from './internal-cache.store';
const CACHE_MANAGER = "CACHE_MANAGER";

@Injectable()
export class InternalCacheService {
    constructor(
      @Inject(CACHE_MANAGER) private readonly cache: Cache<InternalCacheStore>,
    ) {}

    /**
   * Get data fron cache
   * @param {...[string]} tags
   * @returns
   */
    tags(...tags: string[]) {
      this.cache.store.tags(...tags);
      return this;
    }
  
    /**
     * Get data fron cache
     * @param {string} key
     * @returns
     */
    async get<T>(key: string): Promise<T> {
      return await this.cache.get<T>(key);
    }
  
    /**
     * save data to cache
     *
     * @async
     * @template T
     * @param {string} key - unique key used in saving data to cache
     * @param {T} value
     * @param {?number} [ttl] - time in seconds to persist data in cache
     * @returns {*}
     */
    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
      await this.cache.set(key, value, ttl);
    }
  
    /**
     * remove data fron cache using key
     *
     * @async
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key: string): Promise<void> {
      await this.cache.del(key);
    }
  
    /**
     * remove data fron cache using key
     *
     * @async
     * @returns {Promise<void>}
     */
    async flush(): Promise<void> {
      await this.cache.reset();
    }
  
    /**
     * returns and caches data passed in
     *
     * @async
     * @template T
     * @param {string} key
     * @param {T | function(): Promise<T>} value
     * @param {?number} [ttl]
     * @returns {Promise<T>}
     */
    async remember<T>(
      key: string,
      value: T | (() => Promise<T>),
      ttl?: number,
    ): Promise<T> {
      const data = await this.get<T>(key);
      if (data) {
        return data;
      }
      const newData =
        typeof value === 'function' ? await (value as () => Promise<T>)() : value;
      await this.set(key, newData, ttl);
      return newData;
    }

}