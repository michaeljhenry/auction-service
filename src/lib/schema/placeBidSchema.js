const schema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                amount: {
                    type: 'number',
                    minimum: 0
                }
            },
            required: ['amount']
        }
    },
    required: ['body']
}

export default schema;