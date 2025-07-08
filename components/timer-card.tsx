"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, User } from "lucide-react"
import { useGameStore } from "@/lib/game-store"

interface Player {
  id: string
  name: string
  startTime: number
  duration: number
  status: "active" | "expired"
  createdAt: number
}

interface TimerCardProps {
  player: Player
}

export default function TimerCard({ player }: TimerCardProps) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [progress, setProgress] = useState(100)
  const { updatePlayerStatus } = useGameStore()

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now()
      const elapsed = now - player.startTime
      const remaining = player.duration * 60000 - elapsed

      if (remaining <= 0) {
        setTimeLeft(0)
        setProgress(0)
        if (player.status === "active") {
          updatePlayerStatus(player.id, "expired")
          // Mostrar notificación
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`¡Tiempo terminado!`, {
              body: `${player.name} ha completado su tiempo en el juego`,
              icon: "/favicon.ico",
            })
          }
        }
      } else {
        setTimeLeft(remaining)
        const progressPercent = (remaining / (player.duration * 60000)) * 100
        setProgress(progressPercent)
      }
    }

    // Solicitar permisos de notificación
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [player, updatePlayerStatus])

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const isExpiring = timeLeft <= 300000 && timeLeft > 0 // Últimos 5 minutos
  const isExpired = timeLeft <= 0

  return (
    <Card
      className={`transition-all duration-300 ${
        isExpired
          ? "border-red-500 bg-red-50 shadow-lg"
          : isExpiring
            ? "border-orange-500 bg-orange-50 shadow-md animate-pulse"
            : "border-green-500 bg-green-50"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-lg">{player.name}</h3>
          </div>
          <div
            className={`w-4 h-4 rounded-full ${
              isExpired ? "bg-red-500" : isExpiring ? "bg-orange-500" : "bg-green-500"
            }`}
          ></div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tiempo restante:</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span
                className={`font-mono font-bold text-lg ${
                  isExpired ? "text-red-600" : isExpiring ? "text-orange-600" : "text-green-600"
                }`}
              >
                {isExpired ? "00:00" : formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <Progress
            value={progress}
            className={`h-3 ${
              isExpired ? "[&>div]:bg-red-500" : isExpiring ? "[&>div]:bg-orange-500" : "[&>div]:bg-green-500"
            }`}
          />

          <div className="flex justify-between text-xs text-gray-500">
            <span>Duración: {player.duration} min</span>
            <span>Inicio: {new Date(player.startTime).toLocaleTimeString()}</span>
          </div>
        </div>

        {isExpired && (
          <div className="mt-4 p-2 bg-red-100 border border-red-300 rounded text-center">
            <span className="text-red-800 font-medium">¡TIEMPO TERMINADO!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
