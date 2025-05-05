export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/getUser",
  },
  // === New Appointments Endpoints ===
  APPOINTMENTS: {
    GET_ALL: "/api/v1/appointments",
    CREATE: "/api/v1/appointments",
    UPDATE: (id) => `/api/v1/appointments/${id}`,
    DELETE: (id) => `/api/v1/appointments/${id}`,
    INVITE: (id) => `/api/v1/appointments/${id}/invite`,
    GET_ONE: (id) => `/api/v1/appointments/${id}`,
  }
};