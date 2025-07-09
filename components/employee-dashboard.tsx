"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Timer, Users, AlertCircle, LogOut } from "lucide-react"
import TimerCard from "@/components/timer-card"

interface Player {
  id: string
  name: string
  startTime: number
  duration: number
  status: "active" | "expired"
  createdAt: number
}

interface EmployeeDashboardProps {
  onBack: () => void
}

export default function EmployeeDashboard({ onBack }: EmployeeDashboardProps) {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // 🔗 Obtener jugadores desde tu backend en Render
  useEffect(() => {
    fetch("https://inflables-backend.onrender.com/players")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al cargar jugadores:", err)
        setLoading(false)
      })
  }, [])

  // ⏱ Actualizar hora actual cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const activePlayers = players.filter((player) => player.status === "active")
  const expiredPlayers = players.filter((player) => player.status === "expired")

  if (loading) return <p className="text-center">Cargando jugadores...</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="destructive" onClick={onBack}>
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
          <div className="flex gap-2">
            <Users className="text-gray-600" />
            <span>{players.length} jugadores</span>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Jugadores Activos</h2>
        {activePlayers.length === 0 ? (
          <p className="text-gray-500">No hay jugadores activos.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePlayers.map((player) => (
              <TimerCard key={player.id} player={player} />
            ))}
          </div>
        )}

        <h2 className="text-xl font-semibold mt-10 mb-4">Jugadores Expirados</h2>
        {expiredPlayers.length === 0 ? (
          <p className="text-gray-500">No hay jugadores expirados.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiredPlayers.map((player) => (
              <TimerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
