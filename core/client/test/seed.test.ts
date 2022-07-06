import PluginSeed from '../src/plugins/seed';
import Client from '../src/client';
import Control from '../src/control';
import IpcMock from './mock-ipc';

describe('core/client:plugin/seed', () => {
  test('Should be able to get constructed', () => {
    const client = new Client();
    expect(() => new PluginSeed(client)).not.toThrow();
  });

  test('Should be able to find plugin via client', () => {
    const client = new Client([PluginSeed], IpcMock).setup();
    const layers = client.plugin<PluginSeed>('layers');

    expect(layers).toBeDefined();
  });

  test('Should generate seed value', () => {
    const client = new Client();
    const plugin = new PluginSeed(client);

    expect(typeof plugin.seed).toBe('number');
    expect(plugin.seed).not.toBe(0);
  });

  test('Should generate new seed value', () => {
    const client = new Client();
    const plugin = new PluginSeed(client);

    const original = plugin.seed;
    plugin.generate();

    expect(plugin.seed).not.toBe(original);
  });

  test('Should be able to set seed', () => {
    const client = new Client();
    const plugin = new PluginSeed(client);

    plugin.set(0.1);
    expect(plugin.seed).toBe(0.1);
  });
});
