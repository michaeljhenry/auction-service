import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors'; 
import commonMiddleware from '../lib/commonMiddleware';
import validator from '@middy/validator';
import createAuctionSchema from '../lib/schemas/createAuctionSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient(); // this is static so its okay to define it here

async function createAuction(event, context) {
  const { title } = event.body // parsed by httpJsonBodyParser // JSON.parse(event.body);
  const { email } = event.requestContext.authorizer;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);
  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0
    },
    seller: email
  };
  try {
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise(); // returns a promise from the put operation. by default the dynamodb operation will use callbacks. we want to use async await, so we need a promise.
  } catch(error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }


  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(createAuction).use(
  validator({
    inputSchema: createAuctionSchema,
    ajvOptions: {
      strict: false,
    },
  })
);


