import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize: Sequelize;

// Use DATABASE_URL if available (Railway, Heroku, etc.)
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Fallback to individual environment variables (local development)
  const dbDialect = process.env.DB_DIALECT || 'postgres';

  if (dbDialect === 'sqlite') {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DB_NAME || 'test_budget.db',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    });
  } else {
    sequelize = new Sequelize({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'dcops_budget',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password123',
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }
}

export default sequelize;