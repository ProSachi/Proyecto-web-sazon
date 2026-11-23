import axiosClient from '@/core/api/axiosClient'

export const comunidadService = {
  async getPublicaciones(params = {}) {
    try {
      const response = await axiosClient.get('/comunidad', { params })
      return response.data
    } catch (error) {
      console.error('Error consultando comunidad', error)
      throw error
    }
  },
}
