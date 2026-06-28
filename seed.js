const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const mongoose = require("mongoose");
const slugify = require("slugify");

const Story = require("./src/models/Story");
const storiesData = require("./data/stories.json");

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Story.deleteMany({});
    console.log("Cleared existing stories");

    
    const storiesWithSlugs = storiesData.map((story) => ({
      ...story,
      slug: slugify(story.title, {
        lower: true,
        strict: true,
      }),
    }));

    const inserted = await Story.insertMany(storiesWithSlugs);
    console.log(`Inserted ${inserted.length} stories successfully`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);

    await mongoose.disconnect();

    process.exit(1);
  }
};

runSeed();