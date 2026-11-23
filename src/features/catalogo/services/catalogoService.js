import axiosClient from '@/core/api/axiosClient'

export const catalogoService = {
  async getCatalogo(params = {}) {
    try {
      const response = await axiosClient.get('/catalogo', { params })
      return response.data
    } catch (error) {
      console.error('Error consultando catálogo', error)
      throw error
    }
  },
}
