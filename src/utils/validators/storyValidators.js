const { body, validationResult } = require('express-validator');

const storyValidationRules = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('excerpt')
    .notEmpty().withMessage('Excerpt is required')
    .isLength({ min: 10, max: 500 }).withMessage('Excerpt must be between 10 and 500 characters'),
  body('content')
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('mood')
    .notEmpty().withMessage('Mood is required')
    .isIn(['warm', 'dark', 'nostalgic']).withMessage('Mood must be warm, dark, or nostalgic'),
  body('coverImage')
    .notEmpty().withMessage('Cover image URL is required')
    .isURL().withMessage('Cover image must be a valid URL'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array().map((e) => e.msg).join(', '),
    });
  }
  next();
};

module.exports = { storyValidationRules, handleValidationErrors };
