type RecorderState = 'uninitialized' | 'inactive' | 'paused' | 'recording';

interface Navigator {
  getUserMedia(
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: Error) => void
  ): void;
  webkitGetUserMedia(
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: Error) => void
  ): void;
  mozGetUserMedia(
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: Error) => void
  ): void;
}
interface Window {
  AudioContext: AudioContext;
  webkitAudioContext: AudioContext;
  mozAudioContext: AudioContext;
  msAudioContext: AudioContext;
}

interface IStartOption {
  mimeType: string;
  bitsPerSecond: number;
  timeSlice: number;
}
