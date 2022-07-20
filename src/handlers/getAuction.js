import AWS from 'aws-sdk';
import commonMiddleware from "../lib/commonMiddleware";
import createError from 'http-errors'; 

const dynamodb = new AWS.DynamoDB.DocumentClient(); // this is static so its okay to define it here


export async function getAuctionById(id) {
    let auction;
    try {
        const result = await dynamodb.get({ // get is a query, not a scan
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id }
        }).promise();
        
        auction = result.Item; // Item not Items in comparison to a scan
    } catch(error) {
        console.log(error);
        throw new createError.InternalServerError;
    }
    if(!auction) {
        throw new createError.NotFound(`Auction with ID ${id} not found!`);
    }
    return auction;
}

async function getAuction(event, context) {
    const { id } = event.pathParameters;
    const auction = await getAuctionById(id);
    return {
        statusCode: 201,
        body: JSON.stringify(auction),
    };
}

export const handler = commonMiddleware(getAuction);