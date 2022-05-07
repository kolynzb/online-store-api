const router = require('express').Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

//auth Routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/register', authController.register);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authMiddleware.protect); // all routes are below are protected

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.delete('/deleteMe', userController.deleteMe);
router.patch('/updateMe', userController.updateMe);

router.use(authMiddleware.restrictedTo('admin')); // all routes are below restricted to admin

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
