const { renderItem } = require('../public/app.js');

describe('renderItem (unit)', () => {
  test('formats item name and quantity', () => {
    expect(renderItem({ name: 'Widget', quantity: 5 })).toBe('Widget (qty: 5)');
  });

  test('handles zero quantity', () => {
    expect(renderItem({ name: 'Gadget', quantity: 0 })).toBe('Gadget (qty: 0)');
  });
});
