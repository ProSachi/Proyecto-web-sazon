import axiosClient from '@/core/api/axiosClient'

export const nutricionService = {
  async getPerfilNutricional() {
    try {
      const response = await axiosClient.get('/nutricion/perfil')
      return response.data
    } catch (error) {
      console.error('Error consultando perfil nutricional', error)
      throw error
    }
  },
}
