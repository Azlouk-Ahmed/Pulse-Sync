const { Client, Databases } = require('node-appwrite');
require('dotenv').config();

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

// Initialize Appwrite database
const databases = new Databases(client);

const databaseId = process.env.APPWRITE_DATABASE_ID;
const messagesCollectionId = process.env.APPWRITE_MESSAGES_COLLECTION_ID;

module.exports = {
  client,
  databases,
  databaseId,
  messagesCollectionId
};