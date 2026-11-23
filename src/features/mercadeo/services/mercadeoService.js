import axiosClient from '@/core/api/axiosClient'

export const mercadeoService = {
  async getCampanas(params = {}) {
    try {
      const response = await axiosClient.get('/mercadeo/campanas', { params })
      return response.data
    } catch (error) {
      console.error('Error consultando campañas', error)
      throw error
    }
  },
}
