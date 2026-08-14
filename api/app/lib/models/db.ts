import { Sequelize } from 'sequelize';
import path from 'path';
import sqlite3 from 'sqlite3';

// Mirrors config/config.json's per-environment storage paths, so that
// migrations (run via sequelize-cli, which reads NODE_ENV) and the app's
// own Sequelize connection always point at the same SQLite file. Before
// this fix both were hardcoded to dev.sqlite regardless of NODE_ENV,
// which only worked because NODE_ENV was always "development".
const STORAGE_BY_ENV: Record<string, string> = {
  development: './sqlite/dev.sqlite',
  test: './sqlite/test.sqlite',
  production: './sqlite/production.sqlite',
};

const env = process.env.NODE_ENV ?? 'development';
const storage = STORAGE_BY_ENV[env] ?? STORAGE_BY_ENV.development;

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  dialectModule: sqlite3,
  storage: path.resolve(storage),
  logging: false,
});
