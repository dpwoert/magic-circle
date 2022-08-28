import PluginLayers from '../src/plugins/layers';
import Client from '../src/client';
import Control from '../src/control';
import IpcMock from './mock-ipc';

describe('core/client:plugin/layers', () => {
  beforeEach(() => {
    console.warn = jest.fn();
  });

  test('Should be able to get constructed', () => {
    const client = new Client();
    expect(() => new PluginLayers(client)).not.toThrow();
  });

  test('Should be able to find plugin via client', () => {
    const client = new Client([PluginLayers], IpcMock).setup();
    const layers = client.plugin<PluginLayers>('layers');

    expect(layers).toBeDefined();
  });

  test('Should warn when trying to change non-existing control', () => {
    const client = new Client([PluginLayers], IpcMock).setup();
    const layers = client.plugin<PluginLayers>('layers');

    expect(() => layers.set('base.value', 'test2')).not.toThrow();
    expect(console.warn).toBeCalled();
  });

  test('Should be able to change control', () => {
    const ref = { value: 'test' };

    const client = new Client([PluginLayers], IpcMock).setup();
    const layers = client.plugin<PluginLayers>('layers');

    const control = new Control<string>(ref, 'value');
    client.layer.add(control);
    client.flush();

    expect(() => layers.set('base.value', 'test2')).not.toThrow();
    expect(console.warn).not.toBeCalled();
    expect(ref.value).toBe('test2');
  });

  test('Should be able to reset control', () => {
    const ref = { value: 'test' };

    const client = new Client([PluginLayers], IpcMock).setup();
    const layers = client.plugin<PluginLayers>('layers');

    const control = new Control<string>(ref, 'value');
    client.layer.add(control);
    client.flush();

    expect(() => layers.set('base.value', 'test2')).not.toThrow();
    expect(ref.value).toBe('test2');

    layers.reset('base.value');
    expect(ref.value).toBe('test');
    expect(console.warn).not.toBeCalled();
  });

  test('Should be able to reset all controls', () => {
    const ref = { value1: 'test1', value2: 'test2' };

    const client = new Client([PluginLayers], IpcMock).setup();
    const layers = client.plugin<PluginLayers>('layers');

    const control1 = new Control<string>(ref, 'value1');
    const control2 = new Control<string>(ref, 'value2');
    client.layer.add([control1, control2]);
    client.flush();

    layers.set('base.value1', 'test1-update');
    layers.set('base.value2', 'test2-update');

    expect(ref.value1).toBe('test1-update');
    expect(ref.value2).toBe('test2-update');

    layers.resetAll();
    expect(ref.value1).toBe('test1');
    expect(ref.value2).toBe('test2');
    expect(console.warn).not.toBeCalled();
  });

  test('Should be able to set multiple controls', () => {
    const ref = { value1: 'test1', value2: 'test2' };

    const client = new Client([PluginLayers], IpcMock).setup();
    const layers = client.plugin<PluginLayers>('layers');

    const control1 = new Control<string>(ref, 'value1');
    const control2 = new Control<string>(ref, 'value2');
    client.layer.add([control1, control2]);
    client.flush();

    layers.setAll({
      'base.value1': 'test1-update',
      'base.value2': 'test2-update',
    });

    expect(ref.value1).toBe('test1-update');
    expect(ref.value2).toBe('test2-update');
  });

  test('Should be able to set multiple controls, with corrupted paths', () => {
    const ref = { value1: 'test1', value2: 'test2' };

    const client = new Client([PluginLayers], IpcMock).setup();
    const layers = client.plugin<PluginLayers>('layers');

    const control1 = new Control<string>(ref, 'value1');
    const control2 = new Control<string>(ref, 'value2');
    client.layer.add([control1, control2]);
    client.flush();

    layers.setAll({
      'base.value1': 'test1-update',
      'base.value2': 'test2-update',
      'base.value3': 'test3-update',
    });

    expect(ref.value1).toBe('test1-update');
    expect(ref.value2).toBe('test2-update');
    expect(console.warn).toBeCalled();
  });
});
