'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Registration', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      // Personal Information
      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      maritalStatus: {
        type: Sequelize.ENUM('Single', 'Married', 'Divorced', 'Widowed'),
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female'),
        allowNull: false
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      // Education & Professional Information
      educationLevel: {
        type: Sequelize.STRING,
        allowNull: false
      },
      churchOrganization: {
        type: Sequelize.STRING,
        allowNull: false
      },
      position: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      // Recommendation Information
      recommendationName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      recommendationContact: {
        type: Sequelize.STRING,
        allowNull: false
      },
      recommendationRelationship: {
        type: Sequelize.STRING,
        allowNull: false
      },
      recommendationChurch: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      // Membership Information
      membershipPurpose: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      
      // Authorization Fields
      signedBy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      approvedBy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      attestedBy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      // Generated Fields
      regionalCode: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      identificationNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      
      // Status Management
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'declined', 'under_review'),
        defaultValue: 'pending',
        allowNull: false
      },
      statusMessage: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      statusUpdatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      reviewedBy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('Registration', ['email']);
    await queryInterface.addIndex('Registration', ['phone']);
    await queryInterface.addIndex('Registration', ['country']);
    await queryInterface.addIndex('Registration', ['status']);
    await queryInterface.addIndex('Registration', ['createdAt']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Registration');
  }
};
