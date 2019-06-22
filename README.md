# SoundRecorder

SoundRecorder is a website sound recorder SDK base on h5 api.

* **Sdk-based** Base on some h5 api, such as mediaStream, mediaRecorder, audioContext
* **browser supprot:** It just build for PC website record, this sdk is unsupport for h5

## Installation

SoundRecorder build by umd, **you can use it by 2 ways**:

* just append the `<script src="/dist/soundRecorder.min.js"></script>` tag into the html.
* or you can import soundrecorder in to your js.

## Usage

SoundRecorder is very easy to use, You can read the full demo [here](https://ldlh615.github.io/SoundRecorder/) or read the code

```
  // 1. instance the SoundRecorder
  var sr = new SoundRecorder() 

  // 2. start
  sr.start()

  // 3. stop
  sr.stop()

  // 4. get the recorded file
  var blob = sr.getBlob()
  console.log(blob)
```

## Documentation
