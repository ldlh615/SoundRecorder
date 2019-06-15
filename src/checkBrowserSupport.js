export default () => {
	if (!navigator.mediaDevices) {
		navigator.mediaDevices = {}
		if (navigator.mediaDevices.getUserMedia === undefined) {
			const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
			if (!getUserMedia) {
				return false
			} else {
				navigator.mediaDevices.getUserMedia = (constraints) => {
					return new Promise((reslove, reject) => {
						getUserMedia(constraints, (res) => {
							reslove(res)
						}, (err) => {
							reject(err)
						})
					})
				}
			}
		}
	} else {
		return true
	}

	if (!AudioContext || webkitAudioContext) {
		return false
	} else {
		window.AudioContext = window.AudioContext || window.webkitAudioContext || false
	}

	window.requestAnimationFrame = (function () {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60)
			}
	})()

	return true


}