function checkRecordSupport(): boolean {
  return !!(
    window.navigator.mediaDevices?.getUserMedia ||
    window.navigator.getUserMedia ||
    window.navigator.webkitGetUserMedia ||
    window.navigator.mozGetUserMedia ||
    false
  );
}

function checkAudioContextSupport(): boolean {
  return !!(
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.msAudioContext ||
    false
  );
}

function checkMediaRecorderSupport(): boolean {
  return !!window.MediaRecorder;
}

export function checkSupport(): boolean {
  if (
    typeof navigator === 'undefined' ||
    typeof window === 'undefined' ||
    !checkRecordSupport() ||
    !checkAudioContextSupport() ||
    !checkMediaRecorderSupport()
  ) {
    return false;
  }
  return true;
}
