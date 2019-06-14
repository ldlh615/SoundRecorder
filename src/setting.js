// https://developer.mozilla.org/zh-CN/docs/Web/API/MediaTrackConstraints
export const defaultStreamOptions = {
  audio: {
    channelCount: 1,	// 声道
    echoCancellation: true,	// 回声控制
  }
}

// https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder/MediaRecorder
// http://www.w3school.com.cn/media/media_mimeref.asp
export const defaultRecordOptions = {
  mimeType: "audio/webm",	// 格式
  audioBitsPerSecond: "128000",	//比特率
  ignoreMutedMedia: true,
}

export const defaultEventOptions = {
  msg: 'ok',
  code: 0
}

export const errorMsgMap = {
  1001: '无录制流错误',

  1002: '不支持录制器错误',

  1003: '不支持录制格式错误',

  aborterror: [2001, '中止错误'],

  notallowederror: [2002, '拒绝错误'],

  notfounderror: [2003, '找不到错误'],

  notreadableerror: [2004, '无法读取错误'],

  overconstrainederror: [2005, '无法满足要求错误'],

  securityerror: [2006, '安全错误'],

  typeerror: [2007, '类型错误'],

  unknownerror: [2008, '未知错误']


}