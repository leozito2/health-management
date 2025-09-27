"use client"

import { useState } from "react"
import { AppointmentsList } from "@/components/appointments/appointments-list"
import { AppointmentForm } from "@/components/appointments/appointment-form"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AppointmentsPage() {
  const [showForm, setShowForm] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    // The list will automatically refresh when the component re-renders
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {showForm ? (
          <AppointmentForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />
        ) : (
          <AppointmentsList onNewAppointment={() => setShowForm(true)} />
        )}
      </div>
    </div>
  )
}
