export function save(blob: Blob, filename: string) {
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link); // Firefox workaround, see #6594

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  // URL.revokeObjectURL( url ); breaks Firefox...
}

export function saveString(text: string, filename: string) {
  save(new Blob([text], { type: 'text/plain' }), filename);
}

export function saveArrayBuffer(buffer: ArrayBuffer, filename: string) {
  save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
}

export const downloadFile = async (
  url: string,
  fileName: string
): Promise<File> => {
  const resp = await fetch(url);
  const blob = await resp.blob();

  let { type } = blob;

  // support for more file types
  if (fileName.endsWith('mp4')) {
    type = 'video/mp4';
  } else if (fileName.endsWith('png')) {
    type = 'image/png';
  } else if (fileName.endsWith('jpg') || fileName.endsWith('jpeg')) {
    type = 'image/jpeg';
  } else if (fileName.endsWith('gif')) {
    type = 'image/gif';
  } else if (fileName.endsWith('pdf')) {
    type = 'application/pdf';
  }

  return new File([blob], fileName, { type });
};
