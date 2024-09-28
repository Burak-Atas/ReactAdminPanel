import fail from './fail.mp3'
const Fail = () => {
  return null
}

export const playFailSound = () => {
  const audio = new Audio(fail)
  audio.play()
}

export default Fail
