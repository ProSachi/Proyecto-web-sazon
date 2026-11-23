import axiosClient from '@/core/api/axiosClient'

export const despensaService = {
  async getDespensa() {
    try {
      const response = await axiosClient.get('/despensa')
      return response.data
    } catch (error) {
      console.error('Error consultando despensa', error)
      throw error
    }
  },
}
