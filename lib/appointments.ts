export interface Appointment {
  id: string
  userId: string
  patientName: string
  patientCpf: string
  doctorName: string
  specialty: string
  date: Date
  time: string
  location: string
  notes?: string
  status: "scheduled" | "completed" | "cancelled"
  createdAt: Date
}

// Simple in-memory storage for demo purposes
let appointments: Appointment[] = []

export const getAppointments = (): any[] => {
  console.log("[v0] getAppointments called")

  // Load appointments from localStorage if available
  if (typeof window !== "undefined") {
    const storedAppointments = localStorage.getItem("appointments")
    console.log("[v0] Raw stored appointments:", storedAppointments)

    if (storedAppointments) {
      const parsed = JSON.parse(storedAppointments)
      console.log("[v0] Parsed appointments:", parsed)

      const mapped = parsed.map((apt: any) => ({
        ...apt,
        data_consulta: apt.date, // Map to expected field name
        horario_consulta: apt.time, // Map to expected field name
        tipo_consulta: apt.specialty, // Map to expected field name
        nome_medico: apt.doctorName, // Map to expected field name
        date: new Date(apt.date),
        createdAt: new Date(apt.createdAt),
      }))

      console.log("[v0] Mapped appointments:", mapped)
      return mapped
    }
  }

  console.log("[v0] No appointments found, returning empty array")
  return []
}

export const createAppointment = async (appointmentData: {
  tipo_consulta: string
  nome_medico: string
  especialidade: string
  data_consulta: string
  horario_consulta: string
  local_consulta: string
  observacoes?: string
}): Promise<{ success: boolean; error?: string; appointment?: any }> => {
  const newAppointment = {
    id: Math.random().toString(36).substr(2, 9),
    tipo_consulta: appointmentData.tipo_consulta,
    nome_medico: appointmentData.nome_medico,
    especialidade: appointmentData.especialidade,
    data_consulta: appointmentData.data_consulta,
    horario_consulta: appointmentData.horario_consulta,
    local_consulta: appointmentData.local_consulta,
    observacoes: appointmentData.observacoes || "",
    status: "scheduled",
    createdAt: new Date(),
  }

  // Load existing appointments
  let existingAppointments: any[] = []
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("appointments")
    if (stored) {
      existingAppointments = JSON.parse(stored)
    }
  }

  // Add new appointment
  existingAppointments.push(newAppointment)

  // Store back to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("appointments", JSON.stringify(existingAppointments))
  }

  return { success: true, appointment: newAppointment }
}

export const appointmentsService = {
  create: async (
    appointmentData: Omit<Appointment, "id" | "createdAt" | "status">,
  ): Promise<{
    success: boolean
    error?: string
    appointment?: Appointment
  }> => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Math.random().toString(36).substr(2, 9),
      status: "scheduled",
      createdAt: new Date(),
    }

    appointments.push(newAppointment)

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("appointments", JSON.stringify(appointments))
    }

    return { success: true, appointment: newAppointment }
  },

  getByUserId: async (userId: string): Promise<Appointment[]> => {
    // Load appointments from localStorage if available
    if (typeof window !== "undefined") {
      const storedAppointments = localStorage.getItem("appointments")
      if (storedAppointments) {
        appointments = JSON.parse(storedAppointments).map((apt: any) => ({
          ...apt,
          date: new Date(apt.date),
          createdAt: new Date(apt.createdAt),
        }))
      }
    }

    return appointments.filter((apt) => apt.userId === userId)
  },

  searchByCpf: async (cpf: string, userId: string): Promise<Appointment[]> => {
    // Load appointments from localStorage if available
    if (typeof window !== "undefined") {
      const storedAppointments = localStorage.getItem("appointments")
      if (storedAppointments) {
        appointments = JSON.parse(storedAppointments).map((apt: any) => ({
          ...apt,
          date: new Date(apt.date),
          createdAt: new Date(apt.createdAt),
        }))
      }
    }

    return appointments.filter((apt) => apt.userId === userId && apt.patientCpf.includes(cpf))
  },

  update: async (
    id: string,
    updates: Partial<Appointment>,
  ): Promise<{
    success: boolean
    error?: string
    appointment?: Appointment
  }> => {
    const index = appointments.findIndex((apt) => apt.id === id)
    if (index === -1) {
      return { success: false, error: "Consulta não encontrada" }
    }

    appointments[index] = { ...appointments[index], ...updates }

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("appointments", JSON.stringify(appointments))
    }

    return { success: true, appointment: appointments[index] }
  },

  delete: async (id: string): Promise<{ success: boolean; error?: string }> => {
    const index = appointments.findIndex((apt) => apt.id === id)
    if (index === -1) {
      return { success: false, error: "Consulta não encontrada" }
    }

    appointments.splice(index, 1)

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("appointments", JSON.stringify(appointments))
    }

    return { success: true }
  },
}
