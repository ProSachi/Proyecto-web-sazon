import axiosClient from '@/core/api/axiosClient'

export const planificacionService = {
  async getPlanSemanal(params = {}) {
    try {
      const response = await axiosClient.get('/planificacion', { params })
      return response.data
    } catch (error) {
      console.error('Error consultando planificación', error)
      throw error
    }
  },
}
