# SoundRecorder

SoundRecorder is a website sound recorder SDK base on h5 api.

- **Sdk-based** Base on some h5 api, such as mediaStream, mediaRecorder, audioContext
- **browser supprot:** It just build for PC website record, this sdk is unsupport for h5

## Installation

SoundRecorder is build by umd mode, you can use it with cdn or import in your project.

**CDN**

```
<script src="https://cdn.jsdelivr.net/npm/soundrecorder"></script>
```

**NPM**

```
$ npm install soundrecorder
```

## Usage

only 3 step to start the recorder and get the mieda file:

```
// 1. new instance the recorder
const recorder = new Soundrecorder();

// 2. start record
recorder.start()

// 3. stop record
recorder.stop().then((file) => {
  console.log('get the media file:', file)
})
```
