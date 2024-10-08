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
    console.log('Creating user with:', { name, email, password, role }); // Log les données reçues
    const user = new User(null, name, email, password, role);
    try {
        const result = await user.createUser();
        const newUser = {
            id: result.insertId,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
        };
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
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


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      console.log('Login attempt:', { email, password }); // Ajout d'un log pour vérifier les valeurs reçues
      const user = await User.login(email, password);
      if (user) {
        res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  
