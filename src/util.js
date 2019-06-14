import { errorMsgMap } from './setting'

export default {
	createAudioElement() {
		const audioEle = new Audio()
		audioEle.preload = 'auto'
		audioEle.autoplay = true
		return audioEle
	},
	pickEorrorMsg(err) {
		if (typeof err === 'string') {
			if (errorMsgMap.hasOwnProperty(String(err).toLowerCase())) {
				let t = errorMsgMap[String(err).toLowerCase()]
				return {
					code: t[0],
					msg: t[1]
				}
			} else {
				return {
					code: errorMsgMap['unknownerror'][0],
					msg: errorMsgMap['unknownerror'][1],
				}
			}
		} else if (typeof err === 'number') {
			return {
				code: err,
				msg: errorMsgMap[err]

			}
		}


	}
}