import Plugin from '../src/plugin';

export default class PluginMock extends Plugin {
  name = 'mock';

  connect = jest.fn();
  playState = jest.fn();
}
