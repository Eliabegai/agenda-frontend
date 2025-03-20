"use client"

import { useState, useEffect } from "react"


export function useAppointments() {
  const [appointments, setAppointments] = useState<IAgendamento[]>([])
  const [lastAppointment, setLastAppointment] = useState<IAgendamento | null>(null)

  // Load appointments from localStorage on mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem("appointments")
    if (savedAppointments) {
      try {
        const parsedAppointments = JSON.parse(savedAppointments)
        setAppointments(parsedAppointments)

        // Set the most recent appointment
        if (parsedAppointments.length > 0) {
          setLastAppointment(parsedAppointments[parsedAppointments.length - 1])
        }
      } catch (error) {
        console.error("Error parsing saved appointments", error)
      }
    }
  }, [])

  // Save a new appointment
  const saveAppointment = (appointment: IAgendamento) => {
    setAppointments((prev) => {
      const updated = [...prev, appointment]
      localStorage.setItem("appointments", JSON.stringify(updated))
      return updated
    })
    setLastAppointment(appointment)
  }

  // Clear all appointments
  const clearAppointments = () => {
    localStorage.removeItem("appointments")
    setAppointments([])
    setLastAppointment(null)
  }

  return {
    appointments,
    lastAppointment,
    saveAppointment,
    clearAppointments,
    setLastAppointment,
  }
}

