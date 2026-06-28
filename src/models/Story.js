const mongoose = require('mongoose');
const slugify = require('slugify');

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    bio: { type: String, trim: true },
    avatar: { type: String, trim: true },
  },
  { _id: false }
);

const likeSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
  },
  { _id: false }
);

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
  type: String,
  unique: true,
  required: true,
  trim: true,
          },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true, trim: true },
    mood: { type: String, enum: ['warm', 'dark', 'nostalgic'], required: true },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    likes: { type: [likeSchema], default: [], select: false },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
    author: { type: authorSchema, required: true },
  },
  { timestamps: true }
);

storySchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

storySchema.index({ mood: 1 });
storySchema.index({ status: 1 });
storySchema.index({ featured: 1 });
storySchema.index({ createdAt: -1 });
storySchema.index({ slug: 1 });

module.exports = mongoose.model('Story', storySchema);
