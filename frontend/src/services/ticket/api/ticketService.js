import axiosInstance from '../../axiosConfig';

export const ticketService = {
  getTicketsClient: async (clientId) => {
    const response = await axiosInstance.get(`/tickets/client/${clientId}`);
    return response.data;
  },

  getTicket: async (ticketId) => {
    const response = await axiosInstance.get(`/tickets/${ticketId}`);
    return response.data;
  },

  annulerTicket: async (ticketId) => {
    const response = await axiosInstance.put(`/tickets/${ticketId}/annuler`);
    return response.data;
  },

  rembourserTicket: async (ticketId) => {
    const response = await axiosInstance.put(`/tickets/${ticketId}/rembourser`);
    return response.data;
  }
};