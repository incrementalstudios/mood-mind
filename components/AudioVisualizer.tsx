"use client"

import { useEffect, useRef } from "react"

interface AudioVisualizerProps {
  isListening: boolean
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isListening }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isListening) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        const draw = () => {
          analyser.getByteFrequencyData(dataArray)

          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.fillStyle = "rgb(0, 0, 0)"

          const barWidth = (canvas.width / bufferLength) * 2.5
          let x = 0

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] / 2

            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
            gradient.addColorStop(0, "#4F46E5")
            gradient.addColorStop(1, "#9333EA")
            ctx.fillStyle = gradient

            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

            x += barWidth + 1
          }

          animationFrameId = requestAnimationFrame(draw)
        }

        draw()
      })
      .catch((err) => console.error("Error accessing microphone:", err))

    return () => {
      cancelAnimationFrame(animationFrameId)
      audioContext.close()
    }
  }, [isListening])

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={100}
      className={`w-full h-20 ${isListening ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
    />
  )
}

export default AudioVisualizer

