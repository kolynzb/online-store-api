const router = require('express').Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/:id', categoryController.getCategory);
router.get('/', categoryController.getAllCategories);

router.use(authMiddleware.restrictedTo('admin'));

router.post('/', categoryController.createCategory);

router
  .route('/:id')
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
