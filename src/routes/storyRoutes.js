const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  getAllStories,
  getFeaturedStories,
  getStoryById,
  likeStory,
} = require("../controllers/storyController");

const router = express.Router();

const likeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many like requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/", getAllStories);

router.get("/featured", getFeaturedStories);

router.get("/:id", getStoryById);

router.post("/:id/like", likeLimiter, likeStory);

module.exports = router;