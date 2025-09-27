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
  // Load appointments from localStorage if available
  if (typeof window !== "undefined") {
    const storedAppointments = localStorage.getItem("appointments")
    if (storedAppointments) {
      return JSON.parse(storedAppointments).map((apt: any) => ({
        ...apt,
        data_consulta: apt.date, // Map to expected field name
        horario_consulta: apt.time, // Map to expected field name
        tipo_consulta: apt.specialty, // Map to expected field name
        nome_medico: apt.doctorName, // Map to expected field name
        date: new Date(apt.date),
        createdAt: new Date(apt.createdAt),
      }))
    }
  }
  return []
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
