// 사이드 바 썸네일 안에 윈도우 좌표
export interface ContainerScroll {
  left: number,
  top: number
}
export const initContainerScroll = {
  left: 0,
  top: 0
}
// 사이드 바 썸네일 안에 윈도우 크기
export interface ContainerSize {
  ratio: {
    w: number,
    h: number
  },
  coverWidth: number
}
export const initContainerSize = {
  ratio: {
    w: 0,
    h: 0
  },
  coverWidth: 0
}

export interface Size {
  width: number,
  height: number,
  scale: number,
}

export interface Listener {
  id: string, // 캔버스 element id
  name: string, // event name
  handler: (event: MouseEvent | TouchEvent) => void
}