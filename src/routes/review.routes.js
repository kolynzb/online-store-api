const express = require('express');
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

router.use(authMiddleware.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authMiddleware.restrictTo('user'),
    reviewController.setProductUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authMiddleware.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authMiddleware.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
