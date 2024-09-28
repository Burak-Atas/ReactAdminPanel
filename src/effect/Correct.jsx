import correct from './correct.mp3'
const Correct = () => {
  return null
}

export const playCorrectSound = () => {
  const audio = new Audio(correct)
  audio.play()
}

export default Correct
