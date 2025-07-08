"use client"

import { useEffect } from "react"
import { useGameStore } from "@/lib/game-store"

export function useRealtimeSync() {
  const { fetchPlayers, subscribeToPlayers } = useGameStore()

  useEffect(() => {
    // Cargar datos iniciales
    fetchPlayers()

    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToPlayers()

    // Cleanup al desmontar
    return unsubscribe
  }, [fetchPlayers, subscribeToPlayers])
}
