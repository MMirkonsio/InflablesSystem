"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Users, Clock, Trash2, LogOut } from "lucide-react"
import TimerCard from "@/components/timer-card"

interface Player {
  id: string
  name: string
  startTime: number
  duration: number
  status: "active" | "expired"
  createdAt: number
}

interface AdminDashboardProps {
  onBack: () => void
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [name, setName] = useState("")
  const [minutes, setMinutes] = useState("30")
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://inflables-backend.onrender.com/players")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al obtener jugadores:", err)
        setLoading(false)
      })
  }, [])

  const handleAddPlayer = () => {
    if (name.trim() && minutes) {
      fetch("https://inflables-backend.onrender.com/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          duration: parseInt(minutes),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setPlayers((prev) => [data, ...prev]) // actualizar lista local
          setName("")
          setMinutes("30")
        })
        .catch((err) => console.error("Error al agregar jugador:", err))
    }
  }

  const handleLogout = () => {
    onBack()
  }

  const activePlayers = players.filter((player) => player.status === "active")
  const expiredPlayers = players.filter((player) => player.status === "expired")

  if (loading) return <p className="text-center">Cargando jugadores...</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
          <div className="text-right">
            <Users className="inline mr-1 text-gray-600" />
            {players.length} jugadores
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Agregar Jugador</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="minutes">Minutos</Label>
              <Input id="minutes" type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddPlayer}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar
              </Button>
            </div>
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
