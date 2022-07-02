import { IpcBase } from '../src/ipc';

describe('core/client:ipc', () => {
  test('Listener should be added', () => {
    const ipc = new IpcBase();

    ipc.on('test', jest.fn());
    expect(ipc.listeners.test.size).toBe(1);
  });

  test('Multiple listeners should be added', () => {
    const ipc = new IpcBase();

    ipc.on('test', jest.fn());
    ipc.on('test', jest.fn());

    expect(ipc.listeners.test.size).toBe(2);
  });

  test('Listeners should be added multiple times', () => {
    const ipc = new IpcBase();

    const fn = jest.fn();
    ipc.on('test', fn);
    ipc.on('test', fn);
    expect(ipc.listeners.test.size).toBe(1);
  });

  test('Listeners should be triggered', () => {
    const ipc = new IpcBase();

    const fn = jest.fn();
    ipc.on('test', fn);

    ipc.trigger('test', []);
    expect(fn.mock.calls.length).toBe(1);

    ipc.trigger('test', []);
    expect(fn.mock.calls.length).toBe(2);
  });

  test('Listeners should be removed', () => {
    const ipc = new IpcBase();

    const fn = jest.fn();
    ipc.on('test', fn);

    // Listener should be added
    expect(ipc.listeners.test.size).toBe(1);

    // Listener should be removed
    ipc.removeListener('test', fn);
    expect(ipc.listeners.test.size).toBe(0);
  });

  test('All listeners should be removed', () => {
    const ipc = new IpcBase();

    ipc.on('test', jest.fn());
    ipc.on('test', jest.fn());
    ipc.on('test', jest.fn());

    // Listener should be added
    expect(ipc.listeners.test.size).toBe(3);

    // Listener should be removed
    ipc.removeAllListeners('test');
    expect(ipc.listeners.test.size).toBe(0);
  });

  test('Listeners should be triggered only once', () => {
    const ipc = new IpcBase();

    const fn = jest.fn();
    ipc.once('test', fn);

    expect(ipc.listeners.test.size).toBe(1);

    // Trigger first time
    ipc.trigger('test', []);
    expect(fn.mock.calls.length).toBe(1);
    expect(ipc.listeners.test.size).toBe(0);

    // Trying to trigger second time
    ipc.trigger('test', []);
    expect(fn.mock.calls.length).toBe(1);
    expect(ipc.listeners.test.size).toBe(0);
  });
});
