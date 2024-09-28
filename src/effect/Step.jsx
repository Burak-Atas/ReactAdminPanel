import step from './step.mp3'
const Step = () => {
  return null
}

export const playStepSound = () => {
  const audio = new Audio(step)
  audio.play()
}

export default Step
