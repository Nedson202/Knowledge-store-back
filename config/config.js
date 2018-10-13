require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'online_bookstore',
    host: '127.0.0.1',
    port: '5432',
    dialect: 'postgres',
    dialectOptions: {
      useUTC: false
    },
    timezone: '11:00'
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'online_bookstore',
    host: '127.0.0.1',
    port: '5432',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  },
  secretkey: process.env.JWTSECRET,
  admin: process.env.ADMIN,
  adminEmail: process.env.ADMINEMAIL,
};
