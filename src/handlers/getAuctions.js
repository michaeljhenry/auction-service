import AWS from 'aws-sdk';
import createError from 'http-errors'; 
import commonMiddleware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient(); // this is static so its okay to define it here

async function getAuctions(event, context) {
    let auctions;

    try {
        const result = await dynamodb.scan({ 
            TableName: process.env.AUCTIONS_TABLE_NAME 
        }).promise(); // turn it into a promise
        
        auctions = result.Items;
    } catch(error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
    return {
        statusCode: 201,
        body: JSON.stringify(auctions),
    };
}

export const handler = commonMiddleware(getAuctions);


