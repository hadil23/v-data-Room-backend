const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.post('/login', userController.loginUser);
module.exports = router;
