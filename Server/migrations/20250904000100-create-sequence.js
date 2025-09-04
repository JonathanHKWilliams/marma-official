'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the Sequence table used for generating regionalCode and identificationNumber
    await queryInterface.createTable('Sequence', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      current: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });

    // Add composite unique index on (key, country)
    await queryInterface.addIndex('Sequence', ['key', 'country'], {
      unique: true,
      name: 'sequence_key_country_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sequence');
  },
};

