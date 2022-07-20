import AWS from 'aws-sdk';
import commonMiddleware from "../lib/commonMiddleware";
import createError from 'http-errors'; 
import { getAuctionById
 } from './getAuction';
const dynamodb = new AWS.DynamoDB.DocumentClient(); // this is static so its okay to define it here

async function placeBid(event, context) {
    const { id } = event.pathParameters;
    const { amount } = event.body; // already parsed because of middleware in commonMiddleware

    const auction = await getAuctionById(id);

if(auction.status !== 'OPEN') {
    throw new createError.Forbidden(`You cannot bid on closed auctions!`)
}

if(amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}`)
}

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
            ':amount': amount
        },
        ReturnValues: 'ALL_NEW' // give me the item we just updated
    }  
    let updatedAuction;
    try { 
        const result = await dynamodb.update(params).promise();
        updatedAuction = result.Attributes;
    } catch(error) {
        console.error(error);
        throw new createError.InternalServerError;
    }
    return {
        statusCode: 201,
        body: JSON.stringify(updatedAuction),
    };
}

export const handler = commonMiddleware(placeBid);