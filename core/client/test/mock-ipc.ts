import { IpcBase } from '../src/ipc';

export default class IpcMock extends IpcBase {
  async connect() {
    return true;
  }
  // eslint-disable-next-line
  send(channel: string, ...payload: any[]) {}

  // eslint-disable-next-line
  invoke<T>(channel: string, payload?: any): Promise<T> {
    return new Promise((resolve) => {
      resolve(null as any);
    });
  }
}
