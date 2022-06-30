import type { ScreenshotFile } from './index';

export const copyGitCommit = (screenshot: ScreenshotFile) => {
  navigator.clipboard.writeText(`git checkout ${screenshot.data.git.sha}`);
};

export const copyJSON = (screenshot: ScreenshotFile) => {
  navigator.clipboard.writeText(JSON.stringify(screenshot.data));
};
