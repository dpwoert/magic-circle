/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
import { get, set } from 'idb-keyval';

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
} from '@magic-circle/styles';

import Sidebar from './Sidebar';
import ImagePreview from './ImagePreview';
import JsonViewer from './JsonViewer';

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
          disabled: 'showFilePicker' in window === false,
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
            // todo
          },
        },
        {
          label: 'View information',
          icon: 'Information',
          shortcut: 'platform+i',
          onSelect: async () => {
            // todo
          },
        },
        {
          label: 'Copy JSON',
          icon: 'Code',
          onSelect: async () => {
            // todo
          },
        },
        {
          label: 'Copy Git commit',
          icon: 'Code',
          onSelect: async () => {
            // todo
          },
        },
        {
          label: 'Rename screenshot',
          icon: 'Tag',
          onSelect: async () => {
            // todo
          },
        },
        {
          label: 'Delete screenshot',
          icon: 'Trash',
          shortcut: 'platform+backspace',
          onSelect: async () => {
            // todo
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

  async getDirectory() {
    const stored = await get(this.directoryKey());

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
        const arr: ArrayBuffer = await file.arrayBuffer();
        const blob = new Blob([arr], { type: 'image/png' });
        const dataUrl = URL.createObjectURL(blob);

        // todo handle svgs

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
      files
        .filter((file) => !!jsons[file.fileName.replace('.png', '')])
        .map(async (file) => {
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
    const directory = await this.getDirectory();

    // Get date for filename
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const time = `${now.getHours()}.${now.getMinutes()}`;
    const fileName = `${date} ${time}`;

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
      <ImagePreview screenshot={screenshot} />
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

  async renameScreenshot(screenshot: ScreenshotFile) {
    const ext = screenshot.fileName.endsWith('.svg') ? '.svg' : '.png';
    const newName = prompt(
      'How would you like to rename this file?',
      screenshot.fileName.replace('.png', '').replace('.svg', '')
    );

    if (newName) {
      const directory = await this.getDirectory();

      // Ensure we have permission
      const permission = await this.verifyPermission(directory, true);
      if (!permission) return;

      const file = await directory.getFileHandle(screenshot.fileName);
      const json = await directory.getFileHandle(
        screenshot.fileName.replace('.svg', '.json').replace('.png', '.json')
      );
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
    await directory.removeEntry(
      screenshot.fileName.replace('.png', '.json').replace('.svg', '.json')
    );
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
}
