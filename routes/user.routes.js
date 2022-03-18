const router = require('express').Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/register', authController.register);
router.get('/me', userController.getMe, userController.getUser);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
