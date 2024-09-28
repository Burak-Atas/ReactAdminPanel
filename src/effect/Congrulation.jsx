import congrulation from './congrulation.mp3'
const Count = () => {
  return null
}

export const playCongrulationSound = () => {
  const audio = new Audio(congrulation)
  audio.play()
}

export default Count
