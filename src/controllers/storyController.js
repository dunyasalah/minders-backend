const Story = require("../models/Story");

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket.remoteAddress;
};

const getAllStories = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 9));
    const skip = (page - 1) * limit;

    const filter = {
      isPublished: true,
    };

    if (req.query.storyCase) {
      filter.storyCase = req.query.storyCase;
    }

    if (req.query.search) {
      filter.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    const [stories, total] = await Promise.all([
      Story.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-likes"),

      Story.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: "Stories retrieved successfully",
      data: {
        stories,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalStories: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getFeaturedStories = async (req, res, next) => {
  try {
    const stories = await Story.find({
      featured: true,
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .select("-likes");

    res.status(200).json({
      success: true,
      message: "Featured stories retrieved successfully",
      data: {
        stories,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getStoryById = async (req, res, next) => {
  try {
    const story = await Story.findOneAndUpdate(
      {
        _id: req.params.id,
        isPublished: true,
      },
      {
        $inc: {
          views: 1,
        },
      },
      {
        new: true,
      }
    ).select("-likes");

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Story retrieved successfully",
      data: {
        story,
      },
    });
  } catch (error) {
    next(error);
  }
};

const likeStory = async (req, res, next) => {
  try {
    const clientIp = getClientIp(req);

    const story = await Story.findById(req.params.id).select("+likes");

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const alreadyLiked = story.likes.some(
      (entry) => entry.ip === clientIp
    );

    if (alreadyLiked) {
      return res.status(409).json({
        success: false,
        message: "You have already liked this story",
      });
    }

    story.likes.push({
      ip: clientIp,
    });

    story.likesCount += 1;

    await story.save();

    res.status(200).json({
      success: true,
      message: "Story liked successfully",
      data: {
        likesCount: story.likesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStories,
  getFeaturedStories,
  getStoryById,
  likeStory,
};