// 初始化userMedia
import checkBrowserApi from './checkBrowserApi'
import util from './util'

// https://developer.mozilla.org/zh-CN/docs/Web/API/MediaTrackConstraints
const defaultStreamOptions = {
	audio: {
		channelCount: 1,	// 声道
		echoCancellation: true,	// 回声控制
	}
}

// https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder/MediaRecorder
// http://www.w3school.com.cn/media/media_mimeref.asp
const defaultRecordOptions = {
	mimeType: "audio/webm",	// 格式
	audioBitsPerSecond: "128000",	//比特率
	ignoreMutedMedia: true,
}

class SoundRecorder {
	constructor({ streamOptions, recordOptions, audioElement, playWhenRecord }) {
		if(!checkBrowserApi()) {
			return new Error('您的浏览器不支持录制音频,请使用')
		}
		this.streamOptions = Object.assign(defaultStreamOptions, streamOptions)
		this.recordOptions = Object.assign(defaultRecordOptions, recordOptions)
		this.isRecording = false
		this.playWhenRecord = !!playWhenRecord
		this.mediaStream = undefined
		this.audioElement = audioElement || util.createAudioElement()
		this.mediaRecorder = undefined
		this.recordChunks = []
	}

	async initStreamAndRecorder() {
		return await navigator.mediaDevices.getUserMedia(this.streamOptions).then(stream => {
			this.mediaStream = stream

			if (this.playWhenRecord) {
				if (this.audioElement.srcObject !== undefined) {
					this.audioElement.srcObject = stream
				} else {
					let src = window.URL.createObjectURL(stream)
					this.audioElement.src = src
				}
			}
			if (!stream) {
				return false
			}
			if (!MediaRecorder) {
				return false
			}
			if(!MediaRecorder.isTypeSupported(this.recordOptions.mimeType)) {
				return false
			}
			let mediaRecorder = new MediaRecorder(stream, this.recordOptions)
			this.mediaRecorder = mediaRecorder
			this.initRecordeEventListener()
			return true
		}).catch(err => {
			console.error(err.name + ": " + err.message)
			return false
		})


	}

	initRecordeEventListener() {
		this.mediaRecorder.ondataavailable = (blobEvent) => {
			this.recordChunks.push(blobEvent.data)
		}
	}

	getBlob() {
		if (this.recordChunks && this.recordChunks.length) {
			let that = this
			return new Blob(this.recordChunks, {type: this.recordOptions.mimeType})
		}
	}

	async startRecord() {
		if (this.isRecording) {
			return
		}
		if (!this.mediaStream || !this.mediaRecorder) {
			let initResult = await this.initStreamAndRecorder()
			if (!initResult) {
				return false
			}
		}
		this.recordChunks = []
		this.mediaRecorder.start()
		this.isRecording = true
		return
	}

	async stopRecord() {
		if (!this.isRecording || !this.mediaStream || !this.mediaRecorder) {
			return
		}
		console.log(123)
		this.isRecording = false
		this.mediaRecorder.stop()
	}

	// onStartRecord = null
	// onStopRecord = null
	// onVoiceRecordEnd = null
	// onPlayVoice = null
	// onPauseVoice = null
	// onStopVoice = null
	// onVoicePlayEnd = null
	// onUploadVoice = null
}

export default window.SoundRecorder = SoundRecorder