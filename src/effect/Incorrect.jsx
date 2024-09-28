import incorrect from './incorrect.mp3'
const Incorrect = () => {
  return null
}

export const playInCorrectSound = () => {
  const audio = new Audio(incorrect)
  audio.play()
}

export default Incorrect
