"use client"

import { useState } from "react"
import { MedicationsList } from "@/components/medications/medications-list"
import { MedicationForm } from "@/components/medications/medication-form"
import { MedicationChecklist } from "@/components/medications/medication-checklist"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MedicationsPage() {
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
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {showForm ? (
          <MedicationForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />
        ) : (
          <Tabs defaultValue="checklist" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="checklist">Checklist Diário</TabsTrigger>
              <TabsTrigger value="medications">Meus Medicamentos</TabsTrigger>
            </TabsList>

            <TabsContent value="checklist">
              <MedicationChecklist />
            </TabsContent>

            <TabsContent value="medications">
              <MedicationsList onNewMedication={() => setShowForm(true)} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
