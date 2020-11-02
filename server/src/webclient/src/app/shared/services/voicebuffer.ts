const dec = new TextDecoder();

export class VoiceBuffer {
  constructor(
    public conversationId: number,
    public userName: string,
    public frame: Float32Array
  ) {}

  static async fromBlob(
    blob: Blob,
    conversationId: number
  ): Promise<VoiceBuffer> {
    const data = await blob.arrayBuffer();
    const userNameLength = new Uint32Array(data.slice(0, 4))[0];
    const userName = dec.decode(
      new Uint8Array(data.slice(4, 4 + userNameLength))
    );
    const waveData = new Float32Array(data.slice(4 + userNameLength));
    return new VoiceBuffer(conversationId, userName, waveData);
  }
}
