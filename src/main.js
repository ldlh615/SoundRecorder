import { defaultStreamOptions, defaultRecordOptions, defaultEventOptions } from './setting'
import checkBrowserSupport from './checkBrowserSupport'
import util from './util'

class SoundRecorder {

	constructor() {
		if (!checkBrowserSupport()) {
			return new Error('您的浏览器不支持录制音频,请使用Chrome或更高版本的浏览器')
		}

		this.streamOptions = defaultStreamOptions
		this.recordOptions = defaultRecordOptions

		this.mediaStream = undefined
		this.mediaRecorder = undefined
		this.audioTrack = undefined
		this.audioContext = undefined
		this.audioSource = undefined
		this.audioAnalyser = undefined
		this.audioDataArray = undefined

		this.recordChunks = []

		this.eventObject = {}
		this.startRecordParams = {}
		this.timer = null
		this.timeStep = undefined
	}

	get isBrowserSurrpot() {
		return checkBrowserSupport()
	}

	get isRecording() {
		if (!this.mediaStream || !this.mediaRecorder) {
			return false
		}
		if (this.mediaRecorder.state === 'recording') {
			return true
		} else {
			return false
		}
	}

	on(key, cb) {
		this.eventObject[key] = cb
	}

	callEventListener(key, params) {
		if (this.eventObject.hasOwnProperty(key) && this.eventObject[key]) {
			if (typeof params === 'string') {
				params = util.pickEorrorMsg(params)
			}
			if (typeof params === 'number') {
				params = util.pickEorrorMsg(params)
			}
			this.eventObject[key]({ ...defaultEventOptions, ...params })
		}
	}

	initMedia() {
		return navigator.mediaDevices.getUserMedia(this.streamOptions)
			.then(stream => {

				if (!stream) {
					throw this.callEventListener('error', 1001)
					return false
				}

				let audioTracks = stream.getAudioTracks()

				if (!audioTracks || audioTracks.length < 1) {
					throw this.callEventListener('error', 1004)
					return false
				}

				this.mediaStream = stream
				this.audioTrack = audioTracks[0]

				return stream

			})
			.then(stream => {
				if (!window.MediaRecorder) {
					throw this.callEventListener('error', 1002)
					return false
				}
				if (!MediaRecorder.isTypeSupported(this.recordOptions.mimeType)) {
					throw this.callEventListener('error', 1003)
					return false
				}
				this.mediaRecorder = new MediaRecorder(stream, this.recordOptions)
				this.initRecordeEventListener()

				return this.mediaRecorder
			})
			.catch(err => {
				throw this.callEventListener('error', err.name)
				return false
			})
	}

	initRecordeEventListener() {
		this.mediaRecorder.ondataavailable = (blobEvent) => {
			let { splitMillisecond } = this.startRecordParams
			this.recordChunks.push(blobEvent.data)
			if (typeof splitMillisecond == 'number' && splitMillisecond > 0) {
				this.callEventListener('dataReceive', { data: blobEvent.data })
			}
		}
		this.mediaRecorder.onstart = (e) => {
			if (Number(this.startRecordParams.duration) && Number(this.startRecordParams.duration) > 0) {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.stopRecord()
				}, Number(this.startRecordParams.duration))
			}
			this.callEventListener('startRecord', { chunks: this.recordChunks })

			if (this.mediaStream && window.AudioContext) {

				this.audioContext = new AudioContext()
				this.audioSource = this.audioContext.createMediaStreamSource(this.mediaStream)
				this.audioAnalyser = this.audioContext.createAnalyser()
				this.audioAnalyser.fftSize = 1024
				this.audioDataArray = new Uint8Array(this.audioAnalyser.fftSize)
				this.audioSource.connect(this.audioAnalyser)

				const callBackAudioAnalyse = (timestamp) => {
					if (this.mediaStream && window.AudioContext && this.audioContext && this.isRecording) {
						this.audioAnalyser.getByteFrequencyData(this.audioDataArray)
						this.callEventListener('audioAnalyse', { audioDataArray: this.audioDataArray })
						if (Number(this.startRecordParams.analyseDelay)) {
							setTimeout(() => {
								window.requestAnimationFrame(callBackAudioAnalyse)
							}, Number(this.startRecordParams.analyseDelay))
						} else {
							window.requestAnimationFrame(callBackAudioAnalyse)
						}
					}
				}

				window.requestAnimationFrame(callBackAudioAnalyse)

			}

		}
		this.mediaRecorder.onstop = (e) => {
			if (Number(this.startRecordParams.duration) && Number(this.startRecordParams.duration) > 0 && this.timer) {
				clearTimeout(this.timer)
				this.timer = null
			}
			try {
				if (this.audioContext) {
					this.audioAnalyser.disconnect()
					this.audioSource.disconnect()
					this.audioContext.close()
				}
			} catch (err) {

			}
			this.callEventListener('stopRecord', { chunks: this.recordChunks })
		}
	}

	getBlob(type) {
		if (this.recordChunks && this.recordChunks.length) {
			return new Blob(this.recordChunks, { type: this.recordOptions.mimeType })
		} else {
			return null
		}
	}

	startRecord(options = {}) {
		if (this.isRecording) {
			return
		}

		const startFunc = () => {
			this.startRecordParams = { ...options }
			this.recordChunks = []
			if (typeof options.splitMillisecond == 'number' && options.splitMillisecond > 0) {
				this.mediaRecorder.start(options.splitMillisecond)
			} else {
				this.mediaRecorder.start()
			}
		}

		this.initMedia()
			.then(res => {
				startFunc()
			})
			.catch(err => {
				console.log(err)
			})

	}

	stopRecord() {
		if (!this.isRecording || !this.mediaStream || !this.mediaRecorder) {
			return
		}
		this.mediaRecorder.stop()
		this.audioTrack.stop()
	}


}

// window.SoundRecorder = SoundRecorder

export default SoundRecorder
export { SoundRecorder }