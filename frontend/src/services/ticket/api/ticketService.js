import axiosInstance from '../../axiosConfig';

export const ticketService = {
  getTicketsClient: async (clientId) => {
    const response = await axiosInstance.get(`/api/tickets/client/${clientId}`);
    return response.data;
  },

  getTicket: async (ticketId) => {
    const response = await axiosInstance.get(`/api/tickets/${ticketId}`);
    return response.data;
  },

  annulerTicket: async (ticketId) => {
    const response = await axiosInstance.put(`/api/tickets/${ticketId}/annuler`);
    return response.data;
  },

  rembourserTicket: async (ticketId) => {
    const response = await axiosInstance.put(`/api/tickets/${ticketId}/rembourser`);
    return response.data;
  }
};