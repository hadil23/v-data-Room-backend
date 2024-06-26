const User = require('../Models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.getUserById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const user = new User(null, name, email, password, role);
    try {
        await user.createUser();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const user = new User(id, name, email, password, role);
    try {
        await user.updateUser();
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = new User(id);
    try {
        await user.deleteUser();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
