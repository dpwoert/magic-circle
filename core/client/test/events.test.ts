import Events from '../src/events';

describe('core/client:events', () => {
  test('Should be able to get created without errors', () => {
    const events = new Events<{ update: { hook: () => void } }>();
    expect(events).toBeInstanceOf(Events);
  });

  test('Should be able to trigger event multiple times', () => {
    const events = new Events<{
      update: { hook: (show: boolean) => void };
    }>();

    const fn = jest.fn();
    events.on('update', fn);

    events.trigger('update', true);
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(true);

    events.trigger('update', false);
    expect(fn.mock.calls.length).toBe(2);
    expect(fn.mock.calls[1][0]).toBe(false);
  });

  test('Should be able to trigger event only once', () => {
    const events = new Events<{
      update: { hook: (show: boolean) => void };
    }>();

    const fn = jest.fn();
    events.once('update', fn);

    events.trigger('update', true);
    expect(fn.mock.calls.length).toBe(1);

    events.trigger('update', false);
    expect(fn.mock.calls.length).toBe(1);
  });

  test('Should be able to remove all listeners for an event', () => {
    const events = new Events<{
      update: { hook: (show: boolean) => void };
    }>();

    const fn = jest.fn();
    events.on('update', fn);

    events.trigger('update', true);
    expect(fn.mock.calls.length).toBe(1);

    events.removeAllListeners('update');
    events.trigger('update', false);
    expect(fn.mock.calls.length).toBe(1);
  });

  test('Should be able to remove a listeners for an event', () => {
    const events = new Events<{
      update: { hook: (show: boolean) => void };
    }>();

    const fn = jest.fn();
    events.on('update', fn);

    events.trigger('update', true);
    expect(fn.mock.calls.length).toBe(1);

    events.off('update', fn);
    events.trigger('update', false);
    expect(fn.mock.calls.length).toBe(1);
  });

  test('Should be able to trigger for multiple event types', () => {
    const events = new Events<{
      update: { hook: (newVal: string) => void };
      visible: { hook: (show: boolean) => void };
    }>();

    const fn1 = jest.fn();
    const fn2 = jest.fn();
    events.on('update', fn1);
    events.on('visible', fn2);

    events.trigger('update', 'test');
    events.trigger('visible', true);
    expect(fn1.mock.calls.length).toBe(1);
    expect(fn2.mock.calls.length).toBe(1);

    events.trigger('update', 'test');
    events.trigger('visible', true);
    expect(fn1.mock.calls.length).toBe(2);
    expect(fn2.mock.calls.length).toBe(2);
  });

  test('Should be able reset all listeners', () => {
    const events = new Events<{
      update: { hook: (newVal: string) => void };
      visible: { hook: (show: boolean) => void };
    }>();

    const fn1 = jest.fn();
    const fn2 = jest.fn();
    events.on('update', fn1);
    events.on('visible', fn2);

    events.trigger('update', 'test');
    events.trigger('visible', true);
    expect(fn1.mock.calls.length).toBe(1);
    expect(fn2.mock.calls.length).toBe(1);

    events.resetEvents();

    events.trigger('update', 'test');
    events.trigger('visible', true);
    expect(fn1.mock.calls.length).toBe(1);
    expect(fn2.mock.calls.length).toBe(1);
  });
});
