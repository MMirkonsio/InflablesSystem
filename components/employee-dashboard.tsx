"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Timer, Users, AlertCircle, LogOut } from "lucide-react"
import { useGameStore } from "@/lib/game-store"
import TimerCard from "@/components/timer-card"

interface EmployeeDashboardProps {
  onBack: () => void
}

export default function EmployeeDashboard({ onBack }: EmployeeDashboardProps) {
  const { players, loading, error, fetchPlayers, subscribeToPlayers, getActivePlayersCount } = useGameStore()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Cargar datos iniciales
    fetchPlayers()

    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToPlayers()

    // Cleanup al desmontar
    return unsubscribe
  }, [fetchPlayers, subscribeToPlayers])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const activePlayers = players.filter((player) => player.status === "active")
  const expiredPlayers = players.filter((player) => player.status === "expired")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Empleado</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">👤 Usuario</div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Hora actual</p>
              <p className="text-lg font-mono font-bold">{currentTime.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Personas Activas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activePlayers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Vencido</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{expiredPlayers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hoy</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{players.length}</div>
            </CardContent>
          </Card>
        </div>

        {activePlayers.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Timer className="w-6 h-6" />
              Temporizadores Activos
            </h2>
            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando temporizadores...</p>
              </div>
            )}
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {activePlayers.map((player) => (
                <TimerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Timer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay temporizadores activos</h3>
              <p className="text-gray-500">
                Los temporizadores aparecerán aquí cuando el administrador registre nuevas personas
              </p>
            </CardContent>
          </Card>
        )}

        {expiredPlayers.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              Tiempo Vencido
            </h2>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {expiredPlayers.slice(0, 6).map((player) => (
                <Card key={player.id} className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-red-900">{player.name}</h3>
                        <p className="text-sm text-red-600">
                          Tiempo terminado hace{" "}
                          {Math.floor((Date.now() - (player.startTime + player.duration * 60000)) / 60000)} min
                        </p>
                      </div>
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
