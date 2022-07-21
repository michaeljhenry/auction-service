import AWS from 'aws-sdk';
import createError from 'http-errors'; 
import commonMiddleware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient(); // this is static so its okay to define it here
// query based on status
async function getAuctions(event, context) {
    let auctions;
    const { status } = event.queryStringParameters;

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status= :status',
        ExpressionAttributeValues: {
            ':status': status
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        }
    }
    try {
        const result = await dynamodb.query(params).promise(); // turn it into a promise
        
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


