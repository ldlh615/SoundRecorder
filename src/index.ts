import EmitEvent from './EmitEvent';
import { defaultConstraints, defaultStartOption } from './constant';
import { checkSupport } from './util';

class SoundRecorder extends EmitEvent {
  static checkSupport = checkSupport;

  private mediaStream: MediaStream;
  private mediaRecorder: MediaRecorder;
  private chunks: Blob[] = [];
  private startRecordOption: IStartOption;
  private stopResolveCallback: Function;
  private stopRejectCallback: Function;
  private audioTracks: MediaStreamTrack[] = [];

  constructor() {
    super();

    if (!checkSupport()) {
      throw new Error('Your browser is not support');
    }
  }

  public get isSupport(): boolean {
    return checkSupport();
  }

  public get state(): RecorderState {
    if (!this.mediaRecorder || !this.mediaStream) return 'uninitialized';
    const { state } = this.mediaRecorder;
    return state;
  }

  private async initStream(constraints = defaultConstraints): Promise<void> {
    const that = this;
    const initTrackAndEvent = (): void => {
      this.audioTracks = this.mediaStream.getAudioTracks();
      if (!this.audioTracks || !this.audioTracks.length) {
        throw new Error('no microphone device has been found');
      }
    };

    if (window.navigator?.mediaDevices?.getUserMedia) {
      that.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      initTrackAndEvent();
      this.emit('streamavailable', that.mediaStream);
    } else {
      window.navigator.getUserMedia =
        navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      window.navigator.getUserMedia(
        constraints,
        function (res: MediaStream) {
          that.mediaStream = res;
          initTrackAndEvent();
          that.emit('streamavailable', that.mediaStream);
        },
        function (err: Error) {
          throw err;
        }
      );
    }
  }

  private initRecorder(bitsPerSecond: number): void {
    this.mediaRecorder = new window.MediaRecorder(this.mediaStream, {
      mimeType: 'audio/webm',
      bitsPerSecond,
    });
    this.mediaRecorder.onstart = (e: Event) => {
      this.emit('start', e);
    };
    this.mediaRecorder.onstop = (e: Event) => {
      this.stopResolveCallback(this.getFile());
      this.emit('stop', e);
      this.stopTracks();
      this.clearLastCache();
    };
    this.mediaRecorder.onerror = (err: MediaRecorderErrorEvent) => {
      this.emit('error', err);
    };
    this.mediaRecorder.onresume = (e: Event) => {
      this.emit('resume', e);
    };
    this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
      this.chunks.push(e.data);
      this.emit('dataavailable', e);
    };
    this.emit('recorderavailable', this.mediaRecorder);
  }

  private clearLastCache(): void {
    this.chunks = [];
    this.mediaStream = undefined;
    this.mediaRecorder = undefined;
    this.audioTracks = [];
    this.startRecordOption = undefined;
    this.stopResolveCallback = undefined;
    this.stopRejectCallback = undefined;
  }

  public async start(option: IStartOption = defaultStartOption): Promise<void> {
    if (this.state === 'recording') {
      throw new Error('now is recording, please do stop action');
    }
    if (this.state === 'paused') {
      throw new Error('now is paused, please do resume action');
    }

    this.startRecordOption = option;
    const { bitsPerSecond, timeSlice } = option;
    await this.initStream();
    this.initRecorder(bitsPerSecond);
    this.mediaRecorder.start(timeSlice);
  }

  public async pause(): Promise<void> {
    if (this.state === 'uninitialized' || this.state === 'inactive') {
      throw new Error('recorder is ' + this.state + ', please do start action');
    }
    if (this.state === 'paused') {
      throw new Error('now is paused, please do resume action');
    }
    this.mediaRecorder.pause();
  }

  public async resume(): Promise<void> {
    if (this.state === 'uninitialized' || this.state === 'inactive') {
      throw new Error('recorder is ' + this.state + ', please do start action');
    }
    if (this.state === 'recording') {
      throw new Error('now is recording, please stop the recorder at first');
    }
    this.mediaRecorder.resume();
  }

  public async stop(): Promise<File | void> {
    if (this.state === 'uninitialized' || this.state === 'inactive') {
      throw new Error('recorder is ' + this.state + ', please do start action');
    }
    return new Promise((r, j) => {
      this.stopResolveCallback = r;
      this.stopRejectCallback = j;
      this.mediaRecorder.stop();
    });
  }

  private stopTracks(): void {
    for (let t of this.audioTracks) {
      t.stop();
      this.mediaStream.removeTrack(t);
    }
  }

  public getBlob(): Blob {
    return new Blob(this.chunks, {
      type: 'audio/webm',
    });
  }

  public getFile(): File {
    const blob: Blob = this.getBlob();
    return new File([blob], `record-${Date.now() % 10000}.webm`, {
      lastModified: Date.now(),
      type: 'audio/webm',
    });
  }
}

export default SoundRecorder;
