import mongoose from "mongoose";
import Chat from "./models/Chat.js";
import Message from "./models/Message.js";
import "dotenv/config"
import { dummyMessages,sampleChats } from "./utils/helper.js";

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Step 1: Insert sample chats
    console.log('Inserting chats...');
    const insertedChats = await Chat.insertMany(sampleChats);
    console.log(`Inserted ${insertedChats.length} chats`);

    // Step 2: Insert messages
    console.log('Inserting messages...');
    const insertedMessages = await Message.insertMany(dummyMessages);
    console.log(`Inserted ${insertedMessages.length} messages`);

    // Step 3: Update latestMessage for each chat
    console.log('Updating latest messages...');
  }catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();