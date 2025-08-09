const bcrypt = require('bcryptjs');

// In-memory user storage (replace with database in production)
let users = [
  {
    id: '1',
    email: 'admin@demo.com',
    firstName: 'Admin',
    lastName: 'User',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', // admin123
    role: 'admin',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer_not_to_say',
    addresses: [],
    preferences: {
      language: 'en',
      currency: 'USD',
      emailNotifications: {
        orderUpdates: true,
        promotions: true,
        newsletter: true
      }
    },
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: 'user_001',
    email: 'user@demo.com',
    firstName: 'John',
    lastName: 'Doe',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', // admin123
    role: 'user',
    phone: '+1234567890',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    addresses: [
      {
        id: 'addr_001',
        firstName: 'John',
        lastName: 'Doe',
        company: '',
        address1: '123 Main St',
        address2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        phone: '+1234567890',
        isDefault: true
      }
    ],
    preferences: {
      language: 'en',
      currency: 'USD',
      emailNotifications: {
        orderUpdates: true,
        promotions: true,
        newsletter: true
      }
    },
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  }
];

class User {
  static async findByEmail(email) {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  static async findById(id) {
    return users.find(user => user.id === id);
  }

  static async create(userData) {
    const { email, firstName, lastName, password, role = 'user' } = userData;
    
    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      firstName,
      lastName,
      password: hashedPassword,
      role,
      phone: '',
      dateOfBirth: '',
      gender: 'prefer_not_to_say',
      addresses: [],
      preferences: {
        language: 'en',
        currency: 'USD',
        emailNotifications: {
          orderUpdates: true,
          promotions: true,
          newsletter: true
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async update(id, updateData) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Return user without password
    const { password: _, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }

  static async delete(id) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users.splice(userIndex, 1);
    return true;
  }

  static async findAll() {
    // Return all users without passwords
    return users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Helper method to get user without password
  static toJSON(user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = { User }; 