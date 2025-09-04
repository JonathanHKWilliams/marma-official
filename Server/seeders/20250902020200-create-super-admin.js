'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('@admin2025#', 12);
    
    await queryInterface.bulkInsert('User', [{
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'admin@marma.org',
      password: hashedPassword,
      role: 'super_admin',
      firstName: 'Super',
      lastName: 'Admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', {
      email: 'admin@marma.org'
    }, {});
  }
};
