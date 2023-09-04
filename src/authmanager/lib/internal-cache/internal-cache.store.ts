import { CacheStore, CacheStoreFactory } from '@nestjs/cache-manager';
import { Store, StoreConfig } from 'cache-manager';
import { createClient, RedisClientType, RedisClientOptions } from 'redis';


export class InternalCacheStore implements Store, CacheStore {
    constructor(protected readonly config: RedisClientOptions & StoreConfig) {
        this.createClient().connect();
    }

    /**
     * Store name.
     *
     * @var {string}
     */
    name = 'redis';

    /**
     * Redis client instance.
     *
     * @var {RedisClientType}
     */
    protected client: RedisClientType;

    /**
     * Collection of tags.
     *
     * @var {string}
     */
    protected _tags: string[] = [];

    /**
     * Creates a new redis client instance
     *
     * @return  {this}
     */
    protected createClient(): this {
        this.client = createClient(this.config) as RedisClientType;

        return this;
    }

    /**
     * Creates a new redis connection.
     *
     * @return  {this}
     */
    protected connect(): this {
        this.client.connect();

        return this;
    }

    /**
     * Returns the current redis client instance.
     *
     * @return  {RedisClientType}
     */
    getClient(): RedisClientType {
        return this.client;
    }

    /**
     * Add new tags to the collection.
     *
     * @param   {string[]}  tags
     *
     * @return  {this}
     */
    tags(...tags: string[]): this {
        this._tags = [...this._tags, ...tags.flat()];

        return this;
    }

    /**
     * Get data from the cache.
     *
     * @param   {string} key
     *
     * @return  {Promise<T>}
     */
    async get<T>(key: string): Promise<T> {
        const data = await this.client.get(key);
        let decoded: T;

        try {
            decoded = JSON.parse(data);
        } catch {
            /* empty */
        }

        return decoded || (data as T);
    }

    /**
     * Add a new data to the cache.
     *
     * @param   {string} key
     * @param   {T} data
     * @param   {?number} ttl
     *
     * @return  {Promise<void>}
     */
    async set<T>(key: string, data: T, ttl?: number): Promise<void> {
        // Format data to string.
        const value = JSON.stringify(data);

        // Create sets for each tag.
        this._tags.forEach((tag) => {
            this.client.sAdd(`tag:${tag}`, key);
        });

        // Create a set of tags for this key.
        // if (this._tags.length > 0) {
        //   this.client.sAdd(key, this._tags);
        // }

        // Save data to cache.
        await (ttl
            ? this.client.setEx(key, ttl, value)
            : this.client.set(key, value));
    }

    async del(...keys: string[]): Promise<void> {
        // Delete keys from all tag sets.
        this._tags.forEach((tag) => {
            this.client.sRem(tag, keys);
        });

        // Delete keys from cache.
        await this.client.del(keys);
    }

    /**
     * Clears all data in the cache db or attached to the specified tags.
     *
     * @return  {Promise<void>}
     */
    async reset(): Promise<void> {
        // Delete all keys if tags weren't specified.
        if (this._tags.length < 0) {
            throw new Error('Flushing database not allowed.');
        }

        // Get and transform tags
        const tags = this._tags.map((tag) => `tag:${tag}`);

        // Get all keys in all tag sets.
        const keys = await this.client.sUnion(tags);

        // Delete all keys and tags.
        this.client.del([...tags, ...keys]);
    }

    /**
     * Adds multiple datasets to the cache.
     *
     * @param   {Array. <Array. <string, string>>} args
     * @param   {?number}   ttl
     *
     * @return  {Promise<void>}
     */
    async mset(args: [string, unknown][], ttl?: number): Promise<void> {
        const data: [string, string][] = args.map(([key, value]) => [
            key,
            JSON.stringify(value),
        ]);

        if (!ttl) {
            await this.client.mSet(data);

            return;
        }

        const multi = this.client.multi();
        data.forEach(([key, value]) => {
            multi.setEx(key, ttl, value);
        });
        multi.exec();
    }

    /**
     * Gets multiple values from the cache.
     *
     * @param   {Array. <string>} args
     *
     * @return  {Promise<Array. <T>>}
     */
    async mget<T = string>(...args: string[]): Promise<T[]> {
        return this.client.mGet(args).then((values) => {
            return values.map((value) => {
                let decoded: T;

                try {
                    decoded = JSON.parse(value);
                } catch {
                    /* empty */
                }

                return decoded || (value as T);
            });
        });
    }

    /**
     * Delete multiple values from the cache.
     *
     * @param   {Array. <string>}  args
     *
     * @return  {Promise<void>}
     */
    async mdel(...args: string[]): Promise<void> {
        await this.del(...args);
    }

    /**
     * Get the keys in the cache.
     *
     * @param   {string} pattern
     *
     * @return  {Promise<Array. <string>>}
     */
    keys(pattern?: string): Promise<string[]> {
        return this.client.keys(pattern);
    }

    /**
     * Get the ttl of a particular key.
     *
     * @param   {string}   key
     *
     * @return  {Promise<number>}
     */
    ttl(key: string): Promise<number> {
        return this.client.ttl(key);
    }
}

export const InternalCacheStoreFactory: CacheStoreFactory = {
    create: (config: RedisClientOptions & StoreConfig) => {
        return new InternalCacheStore(config);
    },
};
