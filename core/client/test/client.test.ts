import Client from '../src/client';

describe('core/client:client', () => {
  test('Should run setup without IPC', () => {
    const setup = jest.fn();

    const client = new Client();
    client.setup(setup);

    expect(setup.mock.calls.length).toBe(1);
  });

  test('Should run loop without IPC and setup call', (done) => {
    const loop = jest.fn();

    const client = new Client();
    client.loop(loop).start();

    expect(client.autoPlay).toBe(true);

    setTimeout(() => {
      expect(loop).toBeCalled();
      done();
    }, 12);
  });

  test('Should not run loop without start call', (done) => {
    const loop = jest.fn();
    const setup = jest.fn();

    const client = new Client();
    client.setup(setup).loop(loop);

    expect(client.autoPlay).toBe(false);

    setTimeout(() => {
      expect(setup).toBeCalled();
      expect(loop).not.toBeCalled();
      done();
    }, 12);
  });

  test('Should not allow setup hook to be changed after it has run', (done) => {
    const setup = jest.fn();
    const setup2 = jest.fn();

    const client = new Client();
    client.setup(setup).start();

    expect(setup).toBeCalled();

    setTimeout(() => {
      expect(client.setupDone).toBe(true);
      expect(() => client.setup(setup2)).toThrow();
      expect(setup2).not.toBeCalled();
      done();
    }, 12);
  });
});
