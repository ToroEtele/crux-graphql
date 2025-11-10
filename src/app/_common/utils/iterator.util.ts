// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class IteratorUtil {
  // eslint-disable-next-line @typescript-eslint/require-await
  public static async *createAsyncIterable<T>(iterable: Iterable<T>): AsyncIterable<T> {
    for (const elem of iterable) {
      yield elem;
    }
  }
}
