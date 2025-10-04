"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, Plus, Pill, Tablets, Check, AlertTriangle } from "lucide-react"
import { getMedications, createMedication } from "@/lib/medications"

export default function MedicationsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [medications, setMedications] = useState<any[]>([])
  const [formData, setFormData] = useState({
    nome: "",
    principio_ativo: "",
    tipo: "",
    dose: "",
    horario_uso: "",
    data_vencimento: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }
    loadMedications()
  }, [isAuthenticated, router])

  const loadMedications = () => {
    const loadedMedications = getMedications()
    setMedications(loadedMedications)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await createMedication(formData)
      setFormData({
        nome: "",
        principio_ativo: "",
        tipo: "",
        dose: "",
        horario_uso: "",
        data_vencimento: "",
      })
      setShowForm(false)
      loadMedications()
    } catch (error) {
      setError("Erro ao cadastrar medicamento. Tente novamente.")
    }
  }

  const handleConfirmarTomada = (medicamentoId: string) => {
    // Logic for confirming medication intake
    console.log("Confirmando tomada do medicamento:", medicamentoId)
  }

  const diasParaVencimento = (dataVencimento: string) => {
    const hoje = new Date()
    const vencimento = new Date(dataVencimento)
    const diffTime = vencimento.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const isVencido = (dataVencimento: string) => {
    return diasParaVencimento(dataVencimento) < 0
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
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
                onClick={() => router.push("/dashboard")}
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

            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Medicamento</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Gerenciamento de Medicamentos</h2>
          <p className="text-gray-600">Controle seus medicamentos e nunca esqueça de tomar</p>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrar Novo Medicamento</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Medicamento *</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Paracetamol"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Princípio Ativo *</label>
                  <input
                    type="text"
                    name="principio_ativo"
                    value={formData.principio_ativo}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Acetaminofeno"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="Comprimido">Comprimido</option>
                    <option value="Cápsula">Cápsula</option>
                    <option value="Xarope">Xarope</option>
                    <option value="Gotas">Gotas</option>
                    <option value="Injeção">Injeção</option>
                    <option value="Pomada">Pomada</option>
                    <option value="Creme">Creme</option>
                    <option value="Spray">Spray</option>
                    <option value="Adesivo">Adesivo</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dose *</label>
                  <input
                    type="text"
                    name="dose"
                    value={formData.dose}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 500mg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Uso *</label>
                  <input
                    type="time"
                    name="horario_uso"
                    value={formData.horario_uso}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Vencimento *</label>
                  <input
                    type="date"
                    name="data_vencimento"
                    value={formData.data_vencimento}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  Salvar Medicamento
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Medicamentos List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Medicamentos em Uso</h3>
          </div>

          <div className="p-6">
            {medications.length === 0 ? (
              <div className="text-center py-8">
                <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum medicamento registrado</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {medications.map((medicamento) => {
                  const diasVencimento = diasParaVencimento(medicamento.data_vencimento)
                  const vencido = isVencido(medicamento.data_vencimento)

                  return (
                    <div
                      key={medicamento.id}
                      className={`border rounded-xl p-6 hover:shadow-lg transition-shadow ${
                        vencido
                          ? "border-red-300 bg-red-50"
                          : diasVencimento <= 7
                            ? "border-yellow-300 bg-yellow-50"
                            : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              vencido
                                ? "bg-red-500"
                                : diasVencimento <= 7
                                  ? "bg-yellow-500"
                                  : "bg-gradient-to-r from-green-500 to-green-600"
                            }`}
                          >
                            <Tablets className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{medicamento.nome}</h4>
                            <p className="text-gray-600">{medicamento.principio_ativo}</p>
                          </div>
                        </div>

                        {vencido ? (
                          <div className="flex items-center space-x-1 text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm font-medium">Vencido</span>
                          </div>
                        ) : diasVencimento <= 7 ? (
                          <div className="flex items-center space-x-1 text-yellow-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm font-medium">Vence em {diasVencimento} dias</span>
                          </div>
                        ) : null}
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Tipo:</span>
                          <span className="text-sm text-gray-600">{medicamento.tipo}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Dose:</span>
                          <span className="text-sm text-gray-600">{medicamento.dose}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Horário:</span>
                          <span className="text-sm text-gray-600">{medicamento.horario_uso}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Vencimento:</span>
                          <span className="text-sm text-gray-600">{formatDate(medicamento.data_vencimento)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleConfirmarTomada(medicamento.id)}
                        disabled={vencido}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          vencido
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>{vencido ? "Medicamento Vencido" : "Confirmar Tomada"}</span>
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
