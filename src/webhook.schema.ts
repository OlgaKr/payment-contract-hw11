const webhookSchema = {
  type: 'object',
  required: ['id', 'type', 'created', 'data'],
  properties: {
    id: { type: 'string', pattern: '^evt_' },
    type: { type: 'string', const: 'payment_intent.succeeded' },
    created: { type: 'number' },
    data: {
      type: 'object',
      required: ['object'],
      properties: {
        object: {
          type: 'object',
          required: ['id', 'status', 'amount', 'currency'],
          properties: {
            id: { type: 'string', pattern: '^pi_' },
            status: { type: 'string' },
            amount: { type: 'number' },
            currency: { type: 'string' },
          },
        },
      },
    },
  },
} as const;

export default webhookSchema;
