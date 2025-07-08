"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Player {
  id: string
  name: string
  startTime: number
  duration: number // en minutos
  status: "active" | "expired"
  createdAt: number
}

interface GameStore {
  players: Player[]
  loading: boolean
  error: string | null

  // Actions
  fetchPlayers: () => void
  addPlayer: (name: string, duration: number) => void
  updatePlayerStatus: (id: string, status: "active" | "expired") => void
  deletePlayer: (id: string) => void
  subscribeToPlayers: () => () => void

  // Getters
  getActivePlayersCount: () => number
  getTotalPlayersCount: () => number
  clearExpiredPlayers: () => void

  // UI State
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      players: [],
      loading: false,
      error: null,

      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),

      fetchPlayers: () => {
        // Simular carga desde localStorage (ya manejado por persist)
        set({ loading: false, error: null })
      },

      addPlayer: (name: string, duration: number) => {
        const newPlayer: Player = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name,
          startTime: Date.now(),
          duration,
          status: "active",
          createdAt: Date.now(),
        }

        set((state) => {
          const updatedPlayers = [newPlayer, ...state.players]
          // Disparar evento personalizado para sincronización
          window.dispatchEvent(
            new CustomEvent("playersUpdated", {
              detail: { players: updatedPlayers, action: "add", player: newPlayer },
            }),
          )
          return { players: updatedPlayers }
        })
      },

      updatePlayerStatus: (id: string, status: "active" | "expired") => {
        set((state) => {
          const updatedPlayers = state.players.map((player) => (player.id === id ? { ...player, status } : player))
          // Disparar evento personalizado para sincronización
          window.dispatchEvent(
            new CustomEvent("playersUpdated", {
              detail: { players: updatedPlayers, action: "update", playerId: id, status },
            }),
          )
          return { players: updatedPlayers }
        })
      },

      deletePlayer: (id: string) => {
        set((state) => {
          const playerToDelete = state.players.find((p) => p.id === id)
          const updatedPlayers = state.players.filter((player) => player.id !== id)
          // Disparar evento personalizado para sincronización
          window.dispatchEvent(
            new CustomEvent("playersUpdated", {
              detail: { players: updatedPlayers, action: "delete", player: playerToDelete },
            }),
          )
          return { players: updatedPlayers }
        })
      },

      subscribeToPlayers: () => {
        const handleStorageChange = (e: StorageEvent) => {
          if (e.key === "game-store") {
            try {
              const newData = JSON.parse(e.newValue || "{}")
              if (newData.state?.players) {
                set({ players: newData.state.players })
              }
            } catch (error) {
              console.error("Error parsing storage data:", error)
            }
          }
        }

        const handleCustomEvent = (e: CustomEvent) => {
          // Actualizar estado cuando otros componentes hagan cambios
          set({ players: e.detail.players })
        }

        // Escuchar cambios en localStorage (entre pestañas)
        window.addEventListener("storage", handleStorageChange)
        // Escuchar eventos personalizados (misma pestaña)
        window.addEventListener("playersUpdated", handleCustomEvent as EventListener)

        // Función de cleanup
        return () => {
          window.removeEventListener("storage", handleStorageChange)
          window.removeEventListener("playersUpdated", handleCustomEvent as EventListener)
        }
      },

      getActivePlayersCount: () => {
        return get().players.filter((player) => player.status === "active").length
      },

      getTotalPlayersCount: () => {
        return get().players.length
      },

      clearExpiredPlayers: () => {
        set((state) => {
          const updatedPlayers = state.players.filter((player) => player.status === "active")
          // Disparar evento personalizado para sincronización
          window.dispatchEvent(
            new CustomEvent("playersUpdated", {
              detail: { players: updatedPlayers, action: "clearExpired" },
            }),
          )
          return { players: updatedPlayers }
        })
      },
    }),
    {
      name: "game-store",
    },
  ),
)
