/**
 		onStartRecord
		onStopRecord
		onVoiceRecordEnd
		onPlayVoice
		onPauseVoice
		onStopVoice
		onVoicePlayEnd
		onUploadVoice
 *  */


import { defaultStreamOptions, defaultRecordOptions, defaultEventOptions } from './setting'
import checkBrowserApi from './checkBrowserSupport'
import util from './util'

class SoundRecorder {

	constructor({ streamOptions, recordOptions, audioElement, playWhenRecord = true }) {
		if (!checkBrowserApi()) {
			return new Error('您的浏览器不支持录制音频,请使用')
		}

		this.streamOptions = Object.assign(defaultStreamOptions, streamOptions)
		this.recordOptions = Object.assign(defaultRecordOptions, recordOptions)
		this.isRecording = false
		this.playWhenRecord = !!playWhenRecord

		this.mediaStream = undefined
		this.audioElement = audioElement || util.createAudioElement()
		this.mediaRecorder = undefined
		this.audioTrack = undefined

		this.recordChunks = []

		this.eventObject = {}
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
				this.mediaStream = stream

				if (!stream) {
					throw this.callEventListener('error', 1001)
				}

				return stream

			})
			.then(stream => {
				if (!window.MediaRecorder) {
					throw this.callEventListener('error', 1002)
				}
				if (!MediaRecorder.isTypeSupported(this.recordOptions.mimeType)) {
					throw this.callEventListener('error', 1003)
				}
				this.mediaRecorder = new MediaRecorder(stream, this.recordOptions)
				this.initRecordeEventListener()

				return this.mediaRecorder
			})
			.catch(err => {
				throw this.callEventListener('error', err.name)
			})
	}

	initRecordeEventListener() {
		this.mediaRecorder.ondataavailable = (blobEvent) => {
			this.recordChunks.push(blobEvent.data)
		}
	}

	// 	getBlob() {
	// 		if (this.recordChunks && this.recordChunks.length) {
	// 			let that = this
	// 			return new Blob(this.recordChunks, {type: this.recordOptions.mimeType})
	// 		}
	// 	}

	startRecord() {
		if (this.isRecording) {
			return
		}
		if (!this.mediaStream || !this.mediaRecorder) {
			this.initMedia().then(res => {

			}).catch(err => {
			})
		}
		// 		this.recordChunks = []
		// 		this.mediaRecorder.start()
		// 		this.isRecording = true
		// 		return
		this.callEventListener('startRecord')
	}

	stopRecord() {
		// 		if (!this.isRecording || !this.mediaStream || !this.mediaRecorder) {
		// 			return
		// 		}
		// 		this.isRecording = false
		// 		this.mediaRecorder.stop()
		this.callEventListener('stopRecord')
	}


}

// window.SoundRecorder = SoundRecorder

export default SoundRecorder
export { SoundRecorder }