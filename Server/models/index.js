import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';
import process from 'process';
import configFile from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load all model files except this index.js
const modelFiles = fs
  .readdirSync(__dirname)
  .filter(file =>
    file.endsWith('.js') &&
    file !== basename &&
    !file.endsWith('.test.js')
  );

for (const file of modelFiles) {
  const { default: defineModel } = await import(`file:${path.join(__dirname, file)}`);
  const model = defineModel(sequelize, Sequelize.DataTypes);
  db[model.name] = model;

  console.log("Loading All Model:", model)
}

// Setup model associations if defined
for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
