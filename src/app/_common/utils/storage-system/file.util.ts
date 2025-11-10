// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class FileUtil {
  /**
   * Returns a function that returns the full file path (after _root_)
   * without the file extension.
   */
  public static getFullPathFrom(root: string): (path: string) => string {
    return function (filepath: string): string {
      const parsedFilePath = filepath.replace(/\\/g, '/');
      return parsedFilePath.substr(parsedFilePath.indexOf(root) + root.length + 1).slice(0, -3);
    };
  }

  public static streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const _buf = new Array<Uint8Array>();

      stream
        .on('data', (chunk) => _buf.push(chunk))
        .on('end', () => resolve(Buffer.concat(_buf)))
        .on('error', (err) => reject(err));
    });
  }
}
