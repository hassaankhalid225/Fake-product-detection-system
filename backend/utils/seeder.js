const User = require('../models/User');
const bcrypt = require('bcrypt');

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@verichain.com' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'Super Admin',
                email: 'admin@verichain.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Auto-Seeded default Admin -> Email: admin@verichain.com | Password: admin123');
        }
    } catch (seedError) {
        console.error('Seeding failed:', seedError.message);
    }
};

module.exports = { seedAdmin };
