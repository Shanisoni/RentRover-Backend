// Import required dependencies from AWS SDK v3
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

// Initialize AWS SQS client with credentials from environment variables
const sqs = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * @description Send a message to AWS SQS queue
 * @param {Object} params - Message parameters including QueueUrl and MessageBody
 * @returns {Promise<Object>} - SQS response data
 */
async function awsSendMessage(params) {
  try {
    // Create a new SendMessageCommand with the provided params
    const command = new SendMessageCommand(params);
    // Send the message using the SQS client
    const data = await sqs.send(command);
    // Return the response data
    return data;
  } catch (error) {
    // If an error occurs, log the error message
    console.error('Error sending message:', error);
  }
}

/**
 * @description Send bidding data to AWS SQS queue
 * @param {Object} bidData - Bid information to be queued
 * @returns {Promise<Object>} - SQS response
 */
const sendBidToQueue = async (bidData) => {
  const params = {
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageBody: JSON.stringify(bidData),
  };

  // Send the bid data to the queue and return the response
  const response = await awsSendMessage(params);
  return response;
};

// Export functions for use in other modules
module.exports = { sendBidToQueue };
