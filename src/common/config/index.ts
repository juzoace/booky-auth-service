import * as path from 'node:path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), './.env'),
});

const defaultPort = 5400;

export default {
  port: +process.env.PORT || defaultPort,
  env: process.env.ENV,
  baseUrl:
    process.env.BASE_URL ||
      `http://localhost:${+process.env.PORT || defaultPort}`,
  // jwt: {}
  redis: {
    host: process.env.REDIS_HOST,
    user: process.env.REDIS_USER,
    pass: process.env.REDIS_PASS,
    port: process.env.REDIS_PORT,
  },
  kafka: {
    sasl: {
      username: process.env.KAFKA_SASL_USERNAME,
      password: process.env.KAFKA_SASL_PASSWORD,
    },
    brokers: process.env.KAFKA_BROKERS?.split(','),
  },
};