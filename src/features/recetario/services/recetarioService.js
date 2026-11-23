import axiosClient from '@/core/api/axiosClient'

export const recetarioService = {
  async getRecetas(params = {}) {
    try {
      const response = await axiosClient.get('/recetario', { params })
      return response.data
    } catch (error) {
      console.error('Error consultando recetario', error)
      throw error
    }
  },
}
