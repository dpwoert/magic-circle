/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
import { get as getIdb, set as setIdb } from 'idb-keyval';
import { saveAs } from 'file-saver';

import {
  ButtonCollections,
  Plugin,
  App,
  icons,
  LayoutHook,
  CommandLineAction,
  CommandLineReference,
} from '@magic-circle/schema';
import { Store } from '@magic-circle/state';
import {
  Camera,
  Folder,
  Photo,
  Information,
  registerIcon,
  Clock,
  Star,
  Copy,
  DotsVertical,
  Trash,
  Tag,
  Code,
  StreamToTv,
  CheckCircle,
} from '@magic-circle/styles';

import Sidebar from './Sidebar';
import ImagePreview from './ImagePreview';
import JsonViewer from './JsonViewer';
import { copyGitCommit, copyJSON } from './utils';

// Register icons
registerIcon(Camera);
registerIcon(Folder);
registerIcon(Photo);
registerIcon(Information);
registerIcon(Clock);
registerIcon(Star);
registerIcon(DotsVertical);
registerIcon(Copy);
registerIcon(Trash);
registerIcon(Tag);
registerIcon(Code);
registerIcon(StreamToTv);
registerIcon(CheckCircle);

function dataURLtoBlob(dataUrl: string) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  // eslint-disable-next-line
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

async function fileToDataUrl(file: any, type: string) {
  const arr: ArrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arr], { type });
  return URL.createObjectURL(blob);
}

function getNameFromFileName(fileName: string) {
  return fileName.replace('.png', '').replace('.svg', '').replace('.json', '');
}

// Creates a memoization cache to prevent asking for permission over and over
const idbCache: Record<string, any> = {};

const get = async (key: string) => {
  if (idbCache[key]) return idbCache[key];
  const result = await getIdb(key);
  idbCache[key] = result;

  return result;
};

const set = (key: string, value: any) => {
  delete idbCache[key];
  return setIdb(key, value);
};

export type ScreenshotFile = {
  fileName: string;
  name: string;
  size: number;
  createdAt: Date;
  dataUrl: string;
  data: Record<string, any>;
};

export enum ReadMode {
  ALL,
  FAVOURITES,
  RECENT,
}

type ScreenshotExport = {
  data: string;
  type: 'png' | 'svg';
};

export default class Screenshots implements Plugin {
  ipc: App['ipc'];
  client: App;

  name = 'screenshots';

  last: Store<string>;

  async setup(client: App) {
    this.ipc = client.ipc;
    this.client = client;
    this.last = new Store<string>('');

    this.ipc.on('screenshot:save', (_, data: ScreenshotExport) => {
      this.saveScreenshot(data);
    });

    // binding
    this.loadScreenshot = this.loadScreenshot.bind(this);
    this.previewImage = this.previewImage.bind(this);
    this.jsonViewer = this.jsonViewer.bind(this);
    this.toggleFavourite = this.toggleFavourite.bind(this);
  }

  buttons(buttons: ButtonCollections): ButtonCollections {
    return {
      ...buttons,
      screenshots: [
        {
          label: 'screenshot',
          icon: 'Camera',
          onClick: () => {
            this.ipc.send('screenshot:take');
          },
        },
        {
          label: 'directory',
          icon: 'Folder',
          onClick: () => {
            this.changeFolder();
          },
          disabled: 'showOpenFilePicker' in window === false,
        },
      ],
    };
  }

  sidebar() {
    return {
      icon: 'Photo' as icons,
      name: 'screenshots',
      render: <Sidebar app={this.client} screenshots={this} />,
    };
  }

  commands(reference?: CommandLineReference): CommandLineAction[] {
    if (!reference) {
      return [
        {
          label: 'Take screenshot',
          icon: 'Photo',
          shortcut: 'platform+s',
          onSelect: async () => this.ipc.send('screenshot:take'),
        },
        {
          label: 'Change screenshot folder',
          icon: 'Folder',
          onSelect: async () => {
            this.changeFolder();
          },
        },
      ];
    }

    if (reference.type === 'screenshot') {
      return [
        {
          label: 'Show screenshot',
          icon: 'Photo',
          onSelect: async () => {
            const file = await this.getFileFromFilename(reference.id);
            this.previewImage(file);
          },
        },
        {
          label: 'View information',
          icon: 'Information',
          shortcut: 'platform+i',
          onSelect: async () => {
            const file = await this.getFileFromFilename(reference.id);
            this.jsonViewer(file);
          },
        },
        {
          label: 'Copy JSON',
          icon: 'Code',
          onSelect: async () => {
            const file = await this.getFileFromFilename(reference.id);
            copyJSON(file);
          },
        },
        {
          label: 'Copy Git commit',
          icon: 'Code',
          onSelect: async () => {
            const file = await this.getFileFromFilename(reference.id);
            copyGitCommit(file);
          },
        },
        {
          label: 'Rename screenshot',
          icon: 'Tag',
          onSelect: async () => {
            const file = await this.getFileFromFilename(reference.id);
            this.renameScreenshot(file);
          },
        },
        {
          label: 'Delete screenshot',
          icon: 'Trash',
          shortcut: 'platform+backspace',
          onSelect: async () => {
            const file = await this.getFileFromFilename(reference.id);
            this.deleteScreenshot(file);
          },
        },
      ];
    }

    return [];
  }

  private directoryKey(): string {
    const useIframe = this.client.getSetting('directoryBasedOnFrameUrl', false);

    if (useIframe) {
      const frame: HTMLIFrameElement = document.querySelector('#frame iframe');
      return `directory-${frame.src}`;
    }

    return 'directory';
  }

  async getDirectory(promptIfNeeded = true) {
    const stored = await get(this.directoryKey());

    if (!stored && promptIfNeeded) {
      return this.changeFolder();
    }

    return stored;
  }

  async readDirectory(mode: ReadMode): Promise<ScreenshotFile[]> {
    const directory = await this.getDirectory();
    const images: Record<string, ScreenshotFile> = {};
    const jsons: Record<string, any> = {};

    // Ensure we have permission
    const permission = await this.verifyPermission(directory, false);

    if (!permission) {
      return [];
    }

    for await (const entry of directory.values()) {
      if (entry.kind !== 'file') {
        continue;
      }

      const file = await entry.getFile();

      if (file.name.endsWith('.png')) {
        const dataUrl = await fileToDataUrl(file, 'image/png');

        images[getNameFromFileName(file.name)] = {
          fileName: file.name,
          name: getNameFromFileName(file.name),
          size: file.size,
          createdAt: file.lastModifiedDate,
          dataUrl,
          data: {},
        };
      }

      if (file.name.endsWith('.svg')) {
        const dataUrl = await fileToDataUrl(file, 'image/svg+xml');

        images[getNameFromFileName(file.name)] = {
          fileName: file.name,
          name: getNameFromFileName(file.name),
          size: file.size,
          createdAt: file.lastModifiedDate,
          dataUrl,
          data: {},
        };
      }

      // Save reference to data
      if (file.name.endsWith('.json')) {
        jsons[getNameFromFileName(file.name)] = file;
      }
    }

    // Create list
    let files: ScreenshotFile[] = Object.keys(images)
      .map((key) => ({
        ...images[key],
        data: jsons[key],
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // recent only
    if (mode === ReadMode.RECENT) {
      files = files.slice(0, Math.min(files.length, 10));
    }

    // Add data
    files = await Promise.all(
      files
        .filter((file) => !!jsons[file.name])
        .map(async (file) => {
          const data = jsons[file.name];
          const text = await data.text();
          return {
            ...file,
            data: JSON.parse(text),
          };
        })
    );

    // Favourites only
    if (mode === ReadMode.FAVOURITES) {
      files = files.filter((file) => !!file.data.favourite);
    }

    return files;
  }

  async changeFolder() {
    // @ts-ignore
    const directoryHandle = await window.showDirectoryPicker();
    await set(this.directoryKey(), directoryHandle);
    return directoryHandle;
  }

  async saveScreenshotTo(
    directory,
    fileName,
    { data: image, type }: ScreenshotExport,
    saveJSON = true
  ) {
    // Ensure we have permission
    const permission = await this.verifyPermission(directory, true);

    if (!permission) {
      // eslint-disable-next-line
      alert('No permission to save files in folder');
    }

    // Create files
    const fileHandleImage = await directory.getFileHandle(
      `${fileName}.${type}`,
      {
        create: true,
      }
    );

    // Save image
    const writable = await fileHandleImage.createWritable();
    await writable.write(type === 'png' ? dataURLtoBlob(image) : image);
    await writable.close();

    if (saveJSON) {
      // Get data
      const data = await this.client.save();

      const fileHandleJSON = await directory.getFileHandle(`${fileName}.json`, {
        create: true,
      });

      // Save JSON
      const writable2 = await fileHandleJSON.createWritable();
      await writable2.write(JSON.stringify(data));
      await writable2.close();
    }
  }

  async saveScreenshot(screenshot: ScreenshotExport) {
    // Get date for filename
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const time = `${now.getHours()}.${now.getMinutes()}`;
    const fileName = `${date} ${time}`;

    // Firefox fix
    if ('showOpenFilePicker' in window === false) {
      if (screenshot.type === 'png') {
        saveAs(dataURLtoBlob(screenshot.data), `${fileName}.png`);
      } else if (screenshot.type === 'svg') {
        const blob = new Blob([screenshot.data], {
          type: 'image/svg+xml',
        });
        saveAs(blob, `${fileName}.svg`);
      } else {
        throw new Error('Unkown screenshot file type');
      }

      return;
    }

    const directory = await this.getDirectory();

    await this.saveScreenshotTo(directory, fileName, screenshot, true);
    this.last.set(fileName);
  }

  async loadScreenshot(screenshot: ScreenshotFile) {
    await this.client.load(screenshot.data);
  }

  previewImage(screenshot: ScreenshotFile) {
    // Set controls sidebar
    this.client.setLayoutHook(
      LayoutHook.INNER,
      <ImagePreview screenshots={this} screenshot={screenshot} />
    );
  }

  jsonViewer(screenshot: ScreenshotFile) {
    // Set controls sidebar
    this.client.setLayoutHook(
      LayoutHook.INNER,
      <JsonViewer screenshots={this} screenshot={screenshot} />
    );
  }

  async toggleFavourite(screenshot: ScreenshotFile) {
    const fileName = `${screenshot.name}.json`;

    const directory = await this.getDirectory();
    const fileHandleJSON = await directory.getFileHandle(fileName);

    // Save JSON
    const writable2 = await fileHandleJSON.createWritable();
    await writable2.write(
      JSON.stringify({
        ...screenshot.data,
        favourite: !screenshot.data.favourite,
      })
    );
    await writable2.close();
  }

  async renameScreenshot(screenshot: ScreenshotFile) {
    const ext = screenshot.fileName.endsWith('.svg') ? '.svg' : '.png';
    // eslint-disable-next-line
    const newName = prompt(
      'How would you like to rename this file?',
      screenshot.name
    );

    if (newName) {
      const directory = await this.getDirectory();

      // Ensure we have permission
      const permission = await this.verifyPermission(directory, true);
      if (!permission) return;

      const file = await directory.getFileHandle(screenshot.fileName);
      const json = await directory.getFileHandle(`${screenshot.name}.json`);
      const newNameSafe = newName.endsWith(ext) ? newName : `${newName}${ext}`;
      await file.move(newNameSafe);
      await json.move(
        newNameSafe.replace('.svg', '.json').replace('.png', '.json')
      );
    }
  }

  async deleteScreenshot(screenshot: ScreenshotFile) {
    const directory = await this.getDirectory();

    // Ensure we have permission
    const permission = await this.verifyPermission(directory, true);
    if (!permission) return;

    await directory.removeEntry(screenshot.fileName);
    await directory.removeEntry(`${screenshot.name}.json`);
  }

  async verifyPermission(directoryHandle: any, readWrite: boolean) {
    const options = {};
    if (readWrite) {
      // @ts-ignore
      options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await directoryHandle.queryPermission(options)) === 'granted') {
      return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await directoryHandle.requestPermission(options)) === 'granted') {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  }

  async getFileFromFilename(fileName: string): Promise<ScreenshotFile | null> {
    const directory = await this.getDirectory();

    // Ensure we have permission
    const permission = await this.verifyPermission(directory, false);
    if (!permission) return null;

    // Get file handles
    const fileHandle = await directory.getFileHandle(fileName);
    const dataHandle = await directory.getFileHandle(
      `${getNameFromFileName(fileName)}.json`
    );

    // Read files
    const file = await fileHandle.getFile();
    const data = await dataHandle.getFile();

    // Get contents of files
    const dataUrl = await fileToDataUrl(
      file,
      fileName.endsWith('.svg') ? 'image/svg+xml' : 'image/png'
    );
    const text = await data.text();

    return {
      fileName: file.name,
      name: getNameFromFileName(file.name),
      size: file.size,
      createdAt: file.lastModifiedDate,
      dataUrl,
      data: JSON.parse(text),
    };
  }
}
