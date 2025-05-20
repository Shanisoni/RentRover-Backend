// Import required dependencies from AWS SDK v3
const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');
const Bid = require('../../models/bidding.model');
const { sendBidAddedEmail } = require('../mail');

// Initialize AWS SQS client with credentials from environment variables
const sqs = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

/**
 * Function to receive a message from the SQS queue
 * @param {Object} params - Parameters for receiving the message
 * @returns {Object} - The received message from SQS
 */
async function awsReceiveMessage(params) {
  try {
    const command = new ReceiveMessageCommand(params);
    const data = await sqs.send(command);
    return data;
  } catch (error) {
    console.error('Error receiving message:', error);
  }
}

/**
 * @description Process message content and delete it from the queue
 * @param {Object} message - Message object retrieved from SQS
 */
async function processAndDeleteMessage(message) {
  try {
    const deleteParams = {
      QueueUrl: process.env.SQS_QUEUE_URL,
      ReceiptHandle: message.ReceiptHandle,
    };

    const deleteCommand = new DeleteMessageCommand(deleteParams);
    await sqs.send(deleteCommand);
    console.log('Message deleted successfully');
  } catch (error) {
    console.error('Error processing/deleting message:', error);
  }
}

/**
 * @description Retrieve bid information from SQS queue, save to database, and remove from queue
 * @returns {Promise<Array|Object>} - Empty array if no messages or SQS response
 */
const getBidFromQueue = async () => {
  const params = {
    QueueUrl: process.env.SQS_QUEUE_URL,
    MaxNumberOfMessages: 1,
  };

  const response = await awsReceiveMessage(params);
  if (!response.Messages || response.Messages.length === 0) {
    return [];
  }

  const biddingObject = JSON.parse(response.Messages[0].Body);
  const bidding = new Bid(biddingObject);
  await bidding.save();

  // Prepare email data
  const emailBidData = {
    userEmail: biddingObject.user.email,
    userName: biddingObject.user.name,
    carName: biddingObject.car.carName,
    bidAmount: biddingObject.bidAmount,
    startDate: biddingObject.startDate,
    endDate: biddingObject.endDate,
    tripType: biddingObject.tripType,
    ownerName: biddingObject.owner.name,
    ownerEmail: biddingObject.owner.email,
    ownerPhone: biddingObject.owner.phone,
    carDetails: `${biddingObject.car.category} - ${biddingObject.car.numberPlate}`,
  };

  // Send email notification
  await sendBidAddedEmail(emailBidData);

  // Delete the processed message from the queue
  await processAndDeleteMessage(response.Messages[0]);

  return response;
};

// Export functions for use in other modules
module.exports = { getBidFromQueue };
