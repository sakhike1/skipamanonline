const fetch = require('node-fetch');

async function createAdmin() {
  try {
    console.log('🚀 Creating admin user via API...');
    
    const response = await fetch('http://localhost:5000/api/auth/create-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@skipamanstore.com',
        password: 'admin123456',
        firstName: 'Admin',
        lastName: 'User'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@skipamanstore.com');
      console.log('🔑 Password: admin123456');
      console.log('🎯 Role: admin');
      console.log('🚀 You can now login as admin!');
    } else {
      console.log('❌ Error:', data.message);
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.log('💡 Make sure the backend server is running on port 5000');
  }
}

createAdmin();
