const router = require('express').Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');
const reviewRouter = require('./review.routes');

router.use('/:tourId/reviews', reviewRouter);

router.get('/:id', productController.getProduct);
router.get('/', productController.getAllProducts);

router.use(authMiddleware.restrictedTo('admin'));

router.post('/', productController.createProduct);

router
  .route('/:id')
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
