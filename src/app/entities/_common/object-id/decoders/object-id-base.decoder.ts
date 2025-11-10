import { IObjectId } from '../object-id.interface';

/**
 * First position is left for indicating type of globalId S or N
 *
 * When type is S or N:
 *
 *    Next 3 positions are for storing length of type name (Crawl, Project)
 *    Anything to the right of TypeName is ID.
 *    IdType + TypeLengthPaddedTo3Numbers + TypeNameOfTypeLengthLength + ID (S - string, N - number)
 *
 *    N005Crawl1337 -> N + 005 + Crawl + 1337 => Should fetch Crawl with ID 1337
 */
export abstract class ObjectIdBaseDecoder {
  protected errorMessage = 'Malformed ID received.';
  private paddingSize = 3;
  private typeLength;
  protected idStartPosition;
  private type;
  protected id;

  constructor(private encodedId: string) {
    this.typeLength = this.getTypeLength(this.encodedId);
    this.idStartPosition = this.typeLength + this.paddingSize + 1;
    this.type = this.encodedId.substring(1 + this.paddingSize, this.idStartPosition) || undefined;
    this.id = this.encodedId.substring(this.idStartPosition);
  }

  // N008TypeName1 -> N + 008 + TypeName + 1
  // S008TypeNameStringId -> S + 008 + TypeName + StringId
  public decode(): IObjectId {
    return { type: this.type, id: this.getId() };
  }

  protected getId(): number | string {
    return this.encodedId.substring(this.idStartPosition);
  }

  // Parses type length
  private getTypeLength(decodedId: string): number {
    const typeLength = Number(decodedId.substr(1, this.paddingSize));
    if (isNaN(typeLength)) throw new Error(this.errorMessage);
    return typeLength;
  }
}
