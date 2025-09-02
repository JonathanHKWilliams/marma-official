import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Registration = sequelize.define("Registration", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Personal Information
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    maritalStatus: {
      type: DataTypes.ENUM('Single', 'Married', 'Divorced', 'Widowed'),
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female'),
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING, // File path to uploaded image
      allowNull: true,
    },
    
    // Education & Professional Information
    educationLevel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    churchOrganization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    // Recommendation Information
    recommendationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recommendationContact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recommendationRelationship: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recommendationChurch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    // Membership Information
    membershipPurpose: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    
    // Authorization Fields
    signedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    attestedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    // Generated Fields
    regionalCode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    identificationNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    
    // Status Management
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'declined', 'under_review'),
      defaultValue: 'pending',
      allowNull: false,
    },
    statusMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    statusUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "Registration",
    timestamps: true,
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['phone']
      },
      {
        fields: ['country']
      },
      {
        fields: ['status']
      },
      {
        fields: ['createdAt']
      }
    ],
    hooks: {
      beforeCreate: async (registration) => {
        // Generate regional code and identification number
        if (!registration.regionalCode) {
          registration.regionalCode = await generateRegionalCode(registration.country);
        }
        if (!registration.identificationNumber) {
          registration.identificationNumber = await generateIdentificationNumber(registration.country);
        }
      },
      beforeUpdate: (registration) => {
        if (registration.changed('status')) {
          registration.statusUpdatedAt = new Date();
        }
      }
    }
  });

  return Registration;
}

// Helper functions for generating codes
async function generateRegionalCode(country) {
  const countryPrefix = getCountryPrefix(country);
  const timestamp = Date.now().toString().slice(-6);
  return `${countryPrefix}${timestamp}`;
}

async function generateIdentificationNumber(country) {
  const countryCode = getCountryCode(country);
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${countryCode}${randomNum}`;
}

function getCountryPrefix(country) {
  const prefixes = {
    'Liberia': 'ML',
    'Sierra Leone': 'SL',
    'Guinea': 'GN',
    'Ivory Coast': 'IC',
    'Ghana': 'GH',
    'Nigeria': 'NG',
    'Mali': 'MA',
    'Burkina Faso': 'BF',
    'Senegal': 'SN',
    'Gambia': 'GM'
  };
  return prefixes[country] || 'XX';
}

function getCountryCode(country) {
  const codes = {
    'Liberia': 'LIB',
    'Sierra Leone': 'SLE',
    'Guinea': 'GIN',
    'Ivory Coast': 'IVC',
    'Ghana': 'GHA',
    'Nigeria': 'NGA',
    'Mali': 'MLI',
    'Burkina Faso': 'BFA',
    'Senegal': 'SEN',
    'Gambia': 'GMB'
  };
  return codes[country] || 'XXX';
}
