const express= require('express');
const { signUp, login, getAllUsers, updateUser, deleteUser, getuserById } = require('../controllers/user.controller');
const router= express.Router();
const authenticate= require('../middleware/auth.middleware');

router.post('/signup', signUp);
router.post('/login', login);
router.get('/', getAllUsers);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

router.get('/me', authenticate, getuserById);


module.exports= router;