import { generateTokens } from '../middlewares/jwtAuth.js';
import User from '../modules/user.js'



export async function createUser(req, res) {
    try {
        const { email, password, firstName, lastName, role, phone } = req.body;

        if (!email || !password || !firstName || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        let newPassword = await bcrypt.hash(password, salt);
        const result = await User.create({
            email,
            newPassword,
            firstName,
            lastName,
            phone,
            providers: ['local'],
            role: role || 'user'
        });

        res.status(201).json({
            message: 'User created successfully',
            userId: result._id
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        const { email, password, firstName, lastName, role, phone } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const updateFields = {};
        if (email) updateFields.email = email;
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (role) updateFields.role = role;
        if (phone) updateFields.phone = phone

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        const result = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', });

    } catch (error) {

    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const UserRecord = await User.findOne({ email });

        if (!UserRecord) {
            return res.status(401).json({ message: 'user not found' });
        }

        const isValidPassword = await UserRecord.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        UserRecord.lastLogin = new Date();

        const accessToken = await generateTokens(UserRecord._id);

        await UserRecord.save();

        res.status(200).json({
            message: 'Login successful',
            token: accessToken,
            user: {
                id: UserRecord._id,
                name: UserRecord.name,
                email: UserRecord.email,
                avatar: UserRecord.avatar,
                providers: UserRecord.providers,
                role: UserRecord.role || 'admin'
            },
        });

    } catch (error) {
        console.log("🚀 ~ login ~ error:", error)
        res.status(500).json({ error: error.message });
    }
}

export async function getUser(req, res) {
    try {

        const UserRecord = await User.findOne({ _id: req.user._id });
        if (!UserRecord) {
            return res.status(401).json({ message: 'user not found' });
        }
        res.status(200).json({ message: 'User get successfully', UserRecord });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

export async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


//Admin
export async function crateUserAdmin(req, res) {
    try {
        const { email, password, firstName, lastName, role } = req.body;

        if (!email || !password || !firstName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const result = await User.insertOne({ email, password, firstName, providers: ['local'], role: 'admin' });

        res.status(201).json({
            message: 'User created successfully',
            userId: result._id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function dropDown(req, res) {
    try {
        const UserRecord = await User.find({ _id: { $ne: req.user._id, role: 'admin' } }, { firstName: 1, _id: 1 });
        if (!UserRecord) {
            return res.status(401).json({ message: 'user not found' });
        }
        res.status(200).json({ UserRecord });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

export async function getAllUser(req, res) {
    try {

        const UserRecord = await User.find({ _id: { $ne: req.user._id } }, { firstName: 1, _id: 1 });

        if (!UserRecord) {
            return res.status(401).json({ message: 'user not found' });
        }
        res.status(200).json({ message: 'Users get successfully', UserRecord });

    } catch (error) {

    }


}