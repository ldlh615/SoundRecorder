export default {
	createAudioElement() {
		const audioEle = new Audio()
		audioEle.preload = 'auto'
		audioEle.autoplay = true
		return audioEle
	}
}