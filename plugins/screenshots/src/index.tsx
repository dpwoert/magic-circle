import { get, set } from 'idb-keyval';

import {
  ButtonCollections,
  Plugin,
  App,
  icons,
  LayoutHook,
} from '@magic-circle/schema';

import Sidebar from './Sidebar';
import ImagePreview from './ImagePreview';
import JsonViewer from './JsonViewer';

function dataURLtoBlob(dataUrl: string) {
  var arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

async function verifyPermission(directoryHandle: any, readWrite: boolean) {
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

export type ScreenshotFile = {
  fileName: string;
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

export default class Screenshots implements Plugin {
  ipc: App['ipc'];
  client: App;

  name = 'Screenshots';

  async setup(client: App) {
    this.ipc = client.ipc;
    this.client = client;

    this.ipc.on('screenshot:save', (_, dataUrl: string) => {
      this.saveScreenshot(dataUrl);
    });

    // binding
    this.loadScreenshot = this.loadScreenshot.bind(this);
    this.previewImage = this.previewImage.bind(this);
    this.jsonViewer = this.jsonViewer.bind(this);
    this.toggleFavourite = this.toggleFavourite.bind(this);
  }

  buttons(buttons: ButtonCollections): ButtonCollections {
    const toAdd: ButtonCollections['0'] = [
      {
        label: 'screenshot',
        icon: 'Camera',
        onClick: () => {
          this.ipc.send('screenshot:take');
        },
      },
    ];

    if ('mode' in this.ipc) {
      toAdd.unshift({
        label: 'directory',
        icon: 'Folder',
        onClick: () => {
          this.changeFolder();
        },
      });
    }

    return {
      ...buttons,
      screenshots: toAdd,
    };
  }

  sidebar() {
    return {
      icon: 'Photo' as icons,
      render: <Sidebar screenshots={this} />,
    };
  }

  async getDirectory() {
    const stored = await get('directory');

    if (!stored) {
      return this.changeFolder();
    }

    return stored;
  }

  async readDirectory(mode: ReadMode): Promise<ScreenshotFile[]> {
    const directory = await this.getDirectory();
    const images: Record<string, ScreenshotFile> = {};
    const jsons: Record<string, any> = {};

    // Ensure we have permission
    const permission = await verifyPermission(directory, false);

    if (!permission) {
      return [];
    }

    for await (const entry of directory.values()) {
      console.log({ entry });

      if (entry.kind !== 'file') {
        break;
      }

      const file = await entry.getFile();

      if (file.name.endsWith('.png')) {
        const arr: ArrayBuffer = await file.arrayBuffer();
        const blob = new Blob([arr], { type: 'image/png' });
        const dataUrl = URL.createObjectURL(blob);

        images[file.name.replace('.png', '')] = {
          fileName: file.name,
          size: file.size,
          createdAt: file.lastModifiedDate,
          dataUrl,
          data: {},
        };
      }

      // Save reference to data
      if (file.name.endsWith('.json')) {
        jsons[file.name.replace('.json', '')] = file;
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
      files.map(async (file) => {
        const data = jsons[file.fileName.replace('.png', '')];
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
    await set('directory', directoryHandle);
    return directoryHandle;
  }

  async saveScreenshot(dataUrl: string) {
    const blob = dataURLtoBlob(dataUrl);

    // Get date for filename
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const time = `${now.getHours()}.${now.getMinutes()}`;
    const dateTime = `${date} ${time}`;

    const directory = await this.getDirectory();

    // Ensure we have permission
    const permission = await verifyPermission(directory, true);

    if (!permission) {
      alert('No permission to save files in folder');
    }

    // Get data
    const data = await this.client.save();

    // Create files
    const fileHandleImage = await directory.getFileHandle(`${dateTime}.png`, {
      create: true,
    });
    const fileHandleJSON = await directory.getFileHandle(`${dateTime}.json`, {
      create: true,
    });

    // Save image
    const writable = await fileHandleImage.createWritable();
    await writable.write(blob);
    await writable.close();

    // Save JSON
    const writable2 = await fileHandleJSON.createWritable();
    await writable2.write(JSON.stringify(data));
    await writable2.close();
  }

  async loadScreenshot(screenshot: ScreenshotFile) {
    await this.client.load(screenshot.data);
  }

  previewImage(screenshot: ScreenshotFile) {
    // Set controls sidebar
    this.client.setLayoutHook(
      LayoutHook.INNER,
      <ImagePreview screenshot={screenshot} />
    );
  }

  jsonViewer(screenshot: ScreenshotFile) {
    // Set controls sidebar
    this.client.setLayoutHook(
      LayoutHook.INNER,
      <JsonViewer screenshot={screenshot} />
    );
  }

  async toggleFavourite(screenshot: ScreenshotFile) {
    const fileName = screenshot.fileName.replace('.png', '.json');

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
}
