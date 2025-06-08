

const { databases, databaseId, messagesCollectionId } = require('../appwrite'); 
const { ID } = require('node-appwrite');
const twilioClient = require('../twilio');

async function sendMessageService(to, body) {
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!to || !body) {
    throw new Error('Phone number and message body are required');
  }

  
  const twilioMessage = await twilioClient.messages.create({
    body,
    from,
    to
  });

  
  const message = await databases.createDocument(
    databaseId,
    messagesCollectionId,
    ID.unique(),
    {
      to,
      from,
      body,
      status: twilioMessage.status,
      twilioSid: twilioMessage.sid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );

  return message;
}

module.exports = { sendMessageService };
