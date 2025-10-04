"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, History, AlertTriangle, Check } from "lucide-react"

export default function MedicationHistoryPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }
    loadHistory()
  }, [isAuthenticated, router])

  const loadHistory = () => {
    if (typeof window !== "undefined") {
      const historico = JSON.parse(localStorage.getItem("medicationHistory") || "[]")
      setHistory(
        historico.sort(
          (a: any, b: any) =>
            new Date(b.data_tomada || b.data_movido).getTime() - new Date(a.data_tomada || a.data_movido).getTime(),
        ),
      )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/medications")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  MedCare
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Histórico de Medicamentos</h2>
          <p className="text-gray-600">Medicamentos tomados e vencidos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <History className="w-5 h-5" />
              <span>Histórico Completo</span>
            </h3>
          </div>

          <div className="p-6">
            {history.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum registro no histórico</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-xl p-6 ${
                      item.status === "vencido" ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            item.status === "vencido" ? "bg-red-500" : "bg-green-500"
                          }`}
                        >
                          {item.status === "vencido" ? (
                            <AlertTriangle className="w-6 h-6 text-white" />
                          ) : (
                            <Check className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{item.nome}</h4>
                          <p className="text-gray-600">{item.principio_ativo}</p>
                        </div>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === "vencido" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                        }`}
                      >
                        {item.status === "vencido" ? "Vencido" : "Tomado"}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Tipo:</span>
                        <span className="ml-2 text-gray-600">{item.tipo}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Dose:</span>
                        <span className="ml-2 text-gray-600">{item.dose}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Horário:</span>
                        <span className="ml-2 text-gray-600">{item.horario_uso}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          {item.status === "vencido" ? "Movido em:" : "Tomado em:"}
                        </span>
                        <span className="ml-2 text-gray-600">{formatDate(item.data_tomada || item.data_movido)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
