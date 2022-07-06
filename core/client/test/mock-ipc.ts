import { IpcBase } from '../src/ipc';

export default class IpcMock extends IpcBase {
  // eslint-disable-next-line
  send(channel: string, ...payload: any[]) {}
}
