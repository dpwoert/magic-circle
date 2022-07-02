import Control from '../src/control';

describe('core/client:control', () => {
  test('Value should be able to get read', () => {
    const ref = { value: 'test' };
    const control = new Control<string>(ref, 'value');

    expect(control.value).toBe('test');
  });

  test('Value should be able to get set', () => {
    const ref = { value: 'test' };
    const control = new Control<string>(ref, 'value');

    control.value = 'updated';

    expect(control.value).toBe('updated');
    expect(ref.value).toBe('updated');
  });

  test('Value should be able to get reset', () => {
    const ref = { value: 'test' };
    const control = new Control<string>(ref, 'value');

    control.value = 'updated';
    expect(control.value).toBe('updated');

    control.reset();
    expect(control.value).toBe('test');
  });
});
