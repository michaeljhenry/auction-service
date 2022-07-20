import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';

export default handler => middy(handler) // returns a middy object
    .use([
        httpJsonBodyParser(), // parse our stringified event body
        httpEventNormalizer(), // adjust api gateway event object from having non-existent objects when trying to access query parameters, path parameters. reduce room for errors/if statements
        httpErrorHandler() 
    ])