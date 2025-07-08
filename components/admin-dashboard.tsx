"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Users, Clock, Trash2, LogOut } from "lucide-react"
import { useGameStore } from "@/lib/game-store"

interface AdminDashboardProps {
  onBack: () => void
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [name, setName] = useState("")
  const [minutes, setMinutes] = useState("30")
  const {
    players,
    loading,
    error,
    addPlayer,
    deletePlayer,
    fetchPlayers,
    subscribeToPlayers,
    getActivePlayersCount,
    getTotalPlayersCount,
  } = useGameStore()

  useEffect(() => {
    // Cargar datos iniciales
    fetchPlayers()

    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToPlayers()

    // Cleanup al desmontar
    return unsubscribe
  }, [fetchPlayers, subscribeToPlayers])

  const handleAddPlayer = () => {
    if (name.trim() && minutes) {
      addPlayer(name.trim(), Number.parseInt(minutes))
      setName("")
      setMinutes("30")
    }
  }

  const handleDeletePlayer = (id: string, playerName: string) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${playerName}?`)) {
      deletePlayer(id)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddPlayer()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administrador</h1>
          </div>
          <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">👤 admin</div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Personas Activas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{getActivePlayersCount()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registrados</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{getTotalPlayersCount()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {players.length > 0 ? Math.round(players.reduce((acc, p) => acc + p.duration, 0) / players.length) : 30}{" "}
                min
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Registrar Nueva Persona
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la persona</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ingresa el nombre..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="time">Tiempo en minutos</Label>
                <Input
                  id="time"
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  onKeyPress={handleKeyPress}
                  min="1"
                  max="120"
                  className="mt-1"
                />
              </div>
              <Button onClick={handleAddPlayer} className="w-full" size="lg" disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                {loading ? "Registrando..." : "Registrar Persona"}
              </Button>
              {error && <div className="text-center text-red-600 text-sm">Error: {error}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestión de Personas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {players
                  .slice()
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map((player) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        player.status === "active" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-gray-600">
                          {player.duration} min • {new Date(player.startTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            player.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {player.status === "active" ? "Activo" : "Terminado"}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePlayer(player.id, player.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                {players.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No hay personas registradas aún</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
