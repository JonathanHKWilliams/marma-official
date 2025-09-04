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
          registration.regionalCode = await generateRegionalCode(sequelize, registration.country);
        }
        if (!registration.identificationNumber) {
          registration.identificationNumber = await generateIdentificationNumber(sequelize, registration.country);
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
async function generateRegionalCode(sequelize, country) {
  const countryPrefix = getCountryPrefix(country);
  const next = await getNextSequence(sequelize, 'regionalCode', country);
  const seq = String(next).padStart(3, '0');
  return `${countryPrefix}${seq}`;
}

async function generateIdentificationNumber(sequelize, country) {
  const countryCode = getCountryCode(country);
  const next = await getNextSequence(sequelize, 'identificationNumber', country);
  const seq = String(next).padStart(3, '0');
  return `${countryCode}${seq}`;
}

function getSequenceModel(sequelize) {
  if (sequelize.models.Sequence) return sequelize.models.Sequence;
  return sequelize.define('Sequence', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    current: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'Sequence',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['key', 'country'] }
    ]
  });
}

async function getNextSequence(sequelize, key, country) {
  const Sequence = getSequenceModel(sequelize);
  const t = await sequelize.transaction();
  try {
    const [row] = await Sequence.findOrCreate({
      where: { key, country },
      defaults: { current: 0 },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    await row.increment('current', { by: 1, transaction: t });
    await row.reload({ transaction: t });
    await t.commit();
    return row.current;
  } catch (err) {
    await t.rollback();
    throw err;
  }
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
