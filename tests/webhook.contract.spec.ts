import Ajv from 'ajv';
import webhookSchema from '../src/webhook.schema';

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(webhookSchema);

const validPayload = {
  id: 'evt_123456789',
  type: 'payment_intent.succeeded',
  created: 1760000000,
  data: {
    object: {
      id: 'pi_123456789',
      status: 'succeeded',
      amount: 15000,
      currency: 'usd',
    },
  },
};

describe('Stripe payment_intent.succeeded contract', () => {
  test('valid payload matches schema', () => {
    const result = validate(validPayload);

    expect(result).toBe(true);
    expect(validate.errors).toBeNull();
  });

  test('payload without required status is invalid', () => {
    const payloadWithoutStatus = structuredClone(validPayload);
    delete (
      payloadWithoutStatus.data.object as Partial<
        typeof validPayload.data.object
      >
    ).status;

    const result = validate(payloadWithoutStatus);

    expect(result).toBe(false);
    expect(validate.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          keyword: 'required',
          params: { missingProperty: 'status' },
        }),
      ]),
    );
  });

  test('payload with amount as string is invalid', () => {
    const payloadWithWrongAmountType = {
      ...validPayload,
      data: {
        object: {
          ...validPayload.data.object,
          amount: '15000',
        },
      },
    };

    const result = validate(payloadWithWrongAmountType);

    expect(result).toBe(false);
    expect(validate.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          keyword: 'type',
          instancePath: '/data/object/amount',
        }),
      ]),
    );
  });

  test('payload with invalid event id is invalid', () => {
    const payload = {
      id: 'wrong_123',
      type: 'payment_intent.succeeded',
      created: 1720000000,
      data: {
        object: {
          id: 'pi_456',
          status: 'succeeded',
          amount: 15000,
          currency: 'usd',
        },
      },
    };

    const valid = validate(payload);

    expect(valid).toBe(false);
  });
});
