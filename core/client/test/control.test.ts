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

  test('Should crash when invalid key is given', () => {
    expect(() => {
      const ref = {};
      new Control<string>(ref, 'value');
    }).toThrow();
  });

  test('Should crash when invalid object is given', () => {
    expect(() => {
      // @ts-ignore
      new Control<string>(null, 'value');
    }).toThrow();
  });

  test('Should trigger update hook correctly', () => {
    const ref = { value: 'test' };
    const control = new Control<string>(ref, 'value');
    const fn = jest.fn();
    control.onUpdate(fn);

    control.value = 'new';

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith('new');
  });

  test('Should trigger update hook correctly when having multiple listeners', () => {
    const ref = { value: 'test' };
    const control = new Control<string>(ref, 'value');
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    control.onUpdate(fn1);
    control.onUpdate(fn2);

    control.value = 'new';

    expect(fn1).toBeCalledTimes(1);
    expect(fn1).toBeCalledWith('new');
    expect(fn2).toBeCalledTimes(1);
    expect(fn2).toBeCalledWith('new');
  });
});
