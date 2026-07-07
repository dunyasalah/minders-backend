const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
            trim: true,
    },

    authorName: {
      type: String,
      required: true,
      trim: true,
    },

    storyCase: {
      type: String,
      enum: ["Identity", "Silence", "Echoes"],
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    likes: {
      type: [likeSchema],
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

storySchema.index({ storyCase: 1 });
storySchema.index({ isPublished: 1 });
storySchema.index({ featured: 1 });

module.exports = mongoose.model("Story", storySchema);