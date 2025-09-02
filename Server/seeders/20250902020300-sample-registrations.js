'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('registrations', [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        fullName: 'John Doe',
        dateOfBirth: '1990-05-15',
        email: 'john.doe@email.com',
        phone: '+231-777-123-456',
        country: 'Liberia',
        address: '123 Main Street, Monrovia, Liberia',
        maritalStatus: 'married',
        gender: 'male',
        educationLevel: 'Bachelor\'s Degree',
        churchOrganization: 'First Baptist Church',
        position: 'Youth Pastor',
        recommendationName: 'Pastor Smith',
        recommendationContact: '+231-777-987-654',
        recommendationRelationship: 'Senior Pastor',
        recommendationChurch: 'First Baptist Church',
        membershipPurpose: 'To serve in ministry and contribute to the growth of the church',
        status: 'pending',
        regionalCode: 'ML001234',
        identificationNumber: 'LIB001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        fullName: 'Mary Johnson',
        dateOfBirth: '1985-08-22',
        email: 'mary.johnson@email.com',
        phone: '+232-76-555-789',
        country: 'Sierra Leone',
        address: '456 Church Road, Freetown, Sierra Leone',
        maritalStatus: 'single',
        gender: 'female',
        educationLevel: 'Master\'s Degree',
        churchOrganization: 'Methodist Church',
        position: 'Sunday School Teacher',
        recommendationName: 'Rev. Williams',
        recommendationContact: '+232-76-444-333',
        recommendationRelationship: 'District Superintendent',
        recommendationChurch: 'Methodist Church',
        membershipPurpose: 'To advance Christian education and women\'s ministry',
        status: 'approved',
        signedBy: 'Rev. Johnson',
        approvedBy: 'Bishop Davis',
        regionalCode: 'SL001235',
        identificationNumber: 'SLE001',
        statusUpdatedAt: new Date(),
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date()
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174002',
        fullName: 'Samuel Kone',
        dateOfBirth: '1992-12-10',
        email: 'samuel.kone@email.com',
        phone: '+224-622-111-222',
        country: 'Guinea',
        address: '789 Unity Street, Conakry, Guinea',
        maritalStatus: 'single',
        gender: 'male',
        educationLevel: 'High School',
        churchOrganization: 'Pentecostal Assembly',
        position: 'Worship Leader',
        recommendationName: 'Pastor Camara',
        recommendationContact: '+224-622-333-444',
        recommendationRelationship: 'Lead Pastor',
        recommendationChurch: 'Pentecostal Assembly',
        membershipPurpose: 'To develop worship ministry and music programs',
        status: 'under_review',
        reviewedBy: 'Rev. Thompson',
        regionalCode: 'GN001236',
        identificationNumber: 'GIN001',
        statusUpdatedAt: new Date(),
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('registrations', {
      email: ['john.doe@email.com', 'mary.johnson@email.com', 'samuel.kone@email.com']
    }, {});
  }
};
