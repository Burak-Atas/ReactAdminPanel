import count from './count.mp3'
const Count = () => {
  return null
}

export const playCountSound = () => {
  const audio = new Audio(count)
  audio.play()
}

export default Count
