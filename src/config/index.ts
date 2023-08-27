import * as path from 'node:path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), './.env'),
});

export default {
  port: Number.parseInt(process.env.PORT),
  env: process.env.ENV,
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT}`,
  jwt: {
    privateKey: process.env.PRIVATE_KEY,
    publicKey: process.env.PUBLIC_KEY,
    expiresIn: Number.parseInt(process.env.JWT_EXPIRES_IN) || 21_600, // time in seconds
    issuer: process.env.ISSUER || 'crednet/circle', // time in seconds
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    user: process.env.REDIS_USER,
    pass: process.env.REDIS_PASS,
    port: Number.parseInt(process.env.REDIS_PORT),
  },
  kafka: {
    sasl: {
      username: process.env.KAFKA_SASL_USERNAME,
      password: process.env.KAFKA_SASL_PASSWORD,
    },
    brokers: process.env.KAFKA_BROKERS?.split(','),
  },
  fireBaseLinkService: {
    baseUrl: process.env.FIREBASE_BASE_URL,
    key: process.env.FIREBASE_API_KEY,
  },
};
