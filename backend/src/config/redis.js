import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL, { 
  maxRetriesPerRequest: 2,
  retryStrategy(times) {
    if (times > 2) return null; // stop retrying after 2 times
    return Math.min(times * 50, 2000);
  }
});
let errorLogged = false;
redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => {
  if (!errorLogged) {
    console.warn('\x1b[33m%s\x1b[0m', 'Warning: Could not connect to Redis. Running without caching/distributed rate-limiting.');
    errorLogged = true;
  }
});

export default redis;
