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


}