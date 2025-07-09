"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Timer, UserCheck, LogOut } from "lucide-react"
import AdminDashboard from "@/components/admin-dashboard"
import EmployeeDashboard from "@/components/employee-dashboard"
import LoginForm from "@/components/login-form"
import { useRealtimeSync } from "@/hooks/use-realtime-sync"

export default function HomePage() {
  const [userRole, setUserRole] = useState<"admin" | "employee" | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Inicializar sincronización en tiempo real
  useRealtimeSync()


  // ✅ Restaurar sesión si existe en localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as "admin" | "employee" | null
    const auth = localStorage.getItem("isAuthenticated") === "true"

    if (auth && savedRole) {
      setIsAuthenticated(true)
      setUserRole(savedRole)
    }
  }, [])

  const handleLogin = (role: "admin" | "employee") => {
    setUserRole(role)
    setIsAuthenticated(true)
    localStorage.setItem("userRole", role)
    localStorage.setItem("isAuthenticated", "true")
  }

  const handleLogout = () => {
    setUserRole(null)
    setIsAuthenticated(false)
    localStorage.removeItem("userRole")
    localStorage.removeItem("isAuthenticated")
  }

  // Mostrar login si no está autenticado
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  if (userRole === "admin") {
    return <AdminDashboard onBack={handleLogout} />
  }

  if (userRole === "employee") {
    return <EmployeeDashboard onBack={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Juegos Inflables</h1>
            <p className="text-lg text-gray-600">Gestión de temporizadores y control de tiempo</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setUserRole("admin")}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Administrador</CardTitle>
              <CardDescription>Registrar nuevas personas y gestionar el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Acceder como Administrador
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setUserRole("employee")}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Timer className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Empleado</CardTitle>
              <CardDescription>Monitorear temporizadores y personas activas</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline" size="lg">
                Acceder como Empleado
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Registro Fácil</h3>
            <p className="text-sm text-gray-600">Añade personas rápidamente con tiempo personalizado</p>
          </div>
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Timer className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Temporizadores</h3>
            <p className="text-sm text-gray-600">Control automático del tiempo con notificaciones</p>
          </div>
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
              <UserCheck className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Tiempo Real</h3>
            <p className="text-sm text-gray-600">Sincronización instantánea entre roles</p>
          </div>
        </div>
      </div>
    </div>
  )
}
