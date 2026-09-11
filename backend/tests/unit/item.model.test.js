const mongoose = require('mongoose');
const Item = require('../../src/models/Item');

describe('Item model (unit)', () => {
  test('fails validation when name is missing', () => {
    const item = new Item({ quantity: 5 });
    const err = item.validateSync();
    expect(err.errors.name).toBeDefined();
  });

  test('fails validation when quantity is negative', () => {
    const item = new Item({ name: 'Widget', quantity: -1 });
    const err = item.validateSync();
    expect(err.errors.quantity).toBeDefined();
  });

  test('passes validation with valid data', () => {
    const item = new Item({ name: 'Widget', quantity: 10, description: 'A widget' });
    const err = item.validateSync();
    expect(err).toBeUndefined();
  });

  test('defaults quantity to 0 when omitted', () => {
    const item = new Item({ name: 'Widget' });
    expect(item.quantity).toBe(0);
  });

  test('generates a valid ObjectId on creation', () => {
    const item = new Item({ name: 'Widget' });
    expect(mongoose.isValidObjectId(item._id)).toBe(true);
  });
});
