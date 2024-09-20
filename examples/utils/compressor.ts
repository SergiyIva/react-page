import pako from 'pako';

export const compress = (data: JSON) => {
  const compressed = pako.gzip(JSON.stringify(data));
  return Buffer.from(compressed).toString('base64');
};

export const decompress = (data: string) => {
  const compressed = new Uint8Array(Buffer.from(data, 'base64'));
  return JSON.parse(new TextDecoder().decode(pako.ungzip(compressed)));
};
