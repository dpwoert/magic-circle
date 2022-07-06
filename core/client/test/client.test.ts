import Client from '../src/client';
import PluginLayers from '../src/plugins/layers';

import IpcMock from './mock-ipc';
import Plugin from './mock-plugin';

describe('core/client:client', () => {
  test('Should run setup without IPC', () => {
    const setup = jest.fn();

    const client = new Client();
    client.setup(setup);

    expect(setup.mock.calls.length).toBe(1);
  });

  test('Should run loop without IPC', (done) => {
    const loop = jest.fn();

    const client = new Client();
    client.setup().loop(loop).start();

    setTimeout(() => {
      expect(loop).toBeCalled();
      client.stop();
      done();
    }, 12);
  });

  test('Should run loop with IPC', (done) => {
    const client = new Client([], IpcMock);

    client
      .setup()
      .loop((delta) => {
        expect(typeof delta).toBe('number');
        client.stop();
        done();
      })
      .start();
  });

  test('Should run loop without IPC and with setup function', (done) => {
    const loop = jest.fn();
    const setup = jest.fn();

    const client = new Client();
    client.setup(setup).loop(loop).start();

    expect(setup).toBeCalled();

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

    setTimeout(() => {
      expect(setup).toBeCalled();
      expect(loop).not.toBeCalled();
      done();
    }, 12);
  });

  test('Can not start if setup() call is not made', () => {
    const client = new Client();

    expect(() => client.start()).toThrow();
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

  test('Should stop after running', (done) => {
    const loop = jest.fn();

    const client = new Client();
    client.setup().loop(loop).start();

    setTimeout(() => {
      const currentCalls = loop.mock.calls.length;
      expect(currentCalls).toBeGreaterThan(2);
      expect(client.isPlaying).toBe(true);

      client.stop();
      expect(client.isPlaying).toBe(false);

      setTimeout(() => {
        expect(client.isPlaying).toBe(false);
        expect(loop.mock.calls.length).toBe(currentCalls);
        done();
      });
    }, 100);
  });

  test('Should return the correct plugin', () => {
    const client = new Client();

    // @ts-ignore
    client.plugins = [new PluginLayers()];

    expect(client.plugin('layers').name).toBe('layers');
  });

  test('Should destroy the client correctly', () => {
    const client = new Client().setup().start();
    client.destroy();

    expect(client.isPlaying).toBe(false);

    // @ts-ignore
    expect(client.hooks.setup).not.toBeDefined();
    // @ts-ignore
    expect(client.hooks.loop).not.toBeDefined();
    // @ts-ignore
    expect(client.hooks.resize).not.toBeDefined();
    // @ts-ignore
    expect(client.plugins.length).toBe(0);
  });

  test('Should be able to find a plugin', () => {
    const client = new Client().setup();
    const seed = client.plugin('seed');

    expect(seed).toBeDefined();
  });

  test('Should not be able to find a plugin if setup has not run yet', () => {
    const client = new Client();
    expect(() => client.plugin('seed')).toThrow(
      'Plugins not created yet, first run the setup() call'
    );
  });

  test('Should run connect hook on start (with IPC)', (done) => {
    const client = new Client([Plugin], IpcMock);
    client
      .setup()
      .loop(() => {
        const plugin = client.plugin('mock');
        expect(plugin.connect).toBeCalled();

        client.stop();
        done();
      })
      .start();
  });

  test('Should run play hook on start (with IPC)', (done) => {
    const client = new Client([Plugin], IpcMock);

    client.setup().start();

    window.setTimeout(() => {
      const plugin = client.plugin<Plugin>('mock');
      expect(plugin.playState).toHaveBeenLastCalledWith(true);

      client.stop();
      done();
    }, 12);
  });

  test('Should run play hook on stop (with IPC)', (done) => {
    const client = new Client([Plugin], IpcMock);

    client.setup().start();

    window.setTimeout(() => {
      const plugin = client.plugin<Plugin>('mock');
      expect(plugin.playState).toHaveBeenLastCalledWith(true);

      client.stop();
      expect(plugin.playState).toHaveBeenLastCalledWith(false);

      done();
    }, 12);
  });
});
