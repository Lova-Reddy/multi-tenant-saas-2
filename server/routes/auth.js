
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

// Register Tenant
router.post('/register', async (req, res) => {
    try {
        const { tenantName, domain, email, password } = req.body;

        // Check if tenant exists
        const existingTenant = await Tenant.findOne({ where: { domain } });
        if (existingTenant) {
            return res.status(400).json({ message: 'Domain already taken' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create Tenant
        const tenant = await Tenant.create({ name: tenantName, domain });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Admin User
        const user = await User.create({
            email,
            password: hashedPassword,
            role: 'admin',
            tenant_id: tenant.id,
        });

        res.status(201).json({ message: 'Tenant registered successfully', tenant, user: { email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email }, include: Tenant });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                tenant_id: user.tenant_id,
                domain: user.Tenant?.domain
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { email: user.email, role: user.role, domain: user.Tenant?.domain } });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
