import { Redis } from 'ioredis';



export class RedisService {
    private redis: Redis
    constructor() {
        this.redis = new Redis({ host: 'redis' });
        // disconnect when redis dissconncted
        this.redis.on("close", () => {
            this.redis.disconnect();
        })
    }



}