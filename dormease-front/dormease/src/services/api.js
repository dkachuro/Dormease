import axios from "axios";

// Базовый URL API
const API_BASE_URL = "http://34.159.255.166:8000/";

const endpoints = {
  // Applications
  APPLICATIONS_LIST: "api/applications/",
  APPLICATIONS_READ: (id) => `api/applications/${id}/`,
  APPLICATIONS_CREATE: "api/applications/",
  APPLICATIONS_UPDATE: (id) => `api/applications/${id}/`,
  APPLICATIONS_PARTIAL_UPDATE: (id) => `api/applications/${id}/`,
  APPLICATIONS_DELETE: (id) => `api/applications/${id}/`,
  APPLICATIONS_GET_CONTRACT_BASE64: (id) =>
    `api/applications/${id}/contract-base64/`,
  APPLICATIONS_UPLOAD_SIGNED_CONTRACT: (id) =>
    `api/applications/${id}/upload-signed/`,
  APPLICATIONS_CANCEL: (id) => `api/applications/${id}/cancel/`,
  APPLICATIONS_SELECT_ROOM: (id) => `api/applications/${id}/select-room/`,
  APPLICATIONS_APPROVE_ROOM: (id) => `api/applications/${id}/approve-room/`,
  APPLICATIONS_APPROVE: (id) => `api/applications/${id}/approve/`,
  APPLICATIONS_FORCE_UPDATE: (id) => `api/applications/${id}/force-update/`,
  APPLICATIONS_REJECT: (id) => `api/applications/${id}/reject/`,
  PASSWORD_RESET_CONFIRM: "user/password_reset/confirm/",
  PASSWORD_RESET: "user/password_reset/",
  USER_VERIFY_EMAIL: "user/verify-email/",
  USER_2FA_VERIFY: "user/2fa/email/verify/",
  USER_2FA_REQUEST: "user/2fa/email/request/",


  // Support
  SUPPORT_LIST: "api/support/",
  SUPPORT_CREATE: "api/support/",
  SUPPORT_READ: (id) => `api/support/${id}/`,
  SUPPORT_UPDATE: (id) => `api/support/${id}/`,
  SUPPORT_PARTIAL_UPDATE: (id) => `api/support/${id}/`,
  SUPPORT_DELETE: (id) => `api/support/${id}/`,
  SUPPORT_REPLY: (id) => `api/support/${id}/reply/`,

  // User
  USER_LOGIN: "user/login/",
  USER_PROFILE_LIST: "user/profile/",
  USER_PROFILE_UPDATE: "user/profile/",
  USER_REGISTER: "user/register/",
  USER_TOKEN_REFRESH: "user/token/refresh/",
  USER_USERS_LIST: "user/users/",
  USER_USERS_CREATE: "user/users/",
  USER_USER_SELF: "user/user/",
  USER_USERS_READ: (id) => `user/users/${id}/`,
  USER_USERS_UPDATE: (id) => `user/users/${id}/`,
  USER_USERS_PARTIAL_UPDATE: (id) => `user/users/${id}/`,
  USER_USERS_DELETE: (id) => `user/users/${id}/`,

  // Buildings
  BUILDINGS_LIST: "api/buildings/",
  BUILDINGS_READ: (id) => `api/buildings/${id}/`,

  // Metrics
  METRICS_ADMIN_LIST: "api/metrics/admin/",
  METRICS_AITUSA_LIST: "api/metrics/aitusa/",

  // Rooms
  ROOMS_LIST: "api/rooms/",
  ROOMS_READ: (id) => `api/rooms/${id}/`,
  ROOMS_ROOMMATES_INFO: (id) => `api/rooms/${id}/roommates/`,

  // My application
  APPLICATIONS_MY: "api/applications/my/",
  APPLICATIONS_MY_ROOMMATE: "api/applications/my-roommate/",
};

// Создаем axios-инстанс с базовым URL и заголовками
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    const isPublicEndpoint =
      config.url.includes("user/register") ||
      config.url.includes("user/login") ||
      config.url.includes("2fa/email/request") ||
      config.url.includes("2fa/email/verify") ||
      config.url.includes("user/verify-email");

    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const api = {
  getApplicationsList: () => axiosInstance.get(endpoints.APPLICATIONS_LIST),
  getApplicationById: (id) =>
    axiosInstance.get(endpoints.APPLICATIONS_READ(id)),
  createApplication: (data) =>
    axiosInstance.post(endpoints.APPLICATIONS_CREATE, data),
  updateApplication: (id, data) =>
    axiosInstance.put(endpoints.APPLICATIONS_UPDATE(id), data),
  partialUpdateApplication: (id, data) =>
    axiosInstance.patch(endpoints.APPLICATIONS_PARTIAL_UPDATE(id), data),
  deleteApplication: (id) =>
    axiosInstance.delete(endpoints.APPLICATIONS_DELETE(id)),
  getContractBase64: (id) =>
    axiosInstance.get(endpoints.APPLICATIONS_GET_CONTRACT_BASE64(id)),
  verifyEmailToken: (token) =>
    axiosInstance.get(`${endpoints.USER_VERIFY_EMAIL}?token=${token}`),
  uploadSignedContract: (applicationId, file) => {
    const formData = new FormData();
    formData.append("signed_file", file);

    return axiosInstance.post(
      `api/applications/${applicationId}/upload-signed/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  cancelApplication: (id) =>
    axiosInstance.post(endpoints.APPLICATIONS_CANCEL(id)),
  selectRoom: (applicationId, data) =>
    axiosInstance.post(`api/applications/${applicationId}/select-room/`, data),
  approveRoomSelection: (id) =>
    axiosInstance.post(endpoints.APPLICATIONS_APPROVE_ROOM(id)),
  approveApplication: (id, comment) =>
    axiosInstance.post(endpoints.APPLICATIONS_APPROVE(id), {
      admin_comment: comment,
    }),
  cancelApplication: (id, comment) =>
    axiosInstance.post(endpoints.APPLICATIONS_CANCEL(id), {
      admin_comment: comment,
    }),
  getUserSelf: () => axiosInstance.get(endpoints.USER_USER_SELF),
  resetPassword: (data) =>
    axiosInstance.post(endpoints.PASSWORD_RESET_CONFIRM, data),

  rejectApplication: (id, comment) =>
    axiosInstance.post(endpoints.APPLICATIONS_REJECT(id), {
      admin_comment: comment,
    }),

  // Support
  getSupportList: () => axiosInstance.get(endpoints.SUPPORT_LIST),
  createSupport: (data) => axiosInstance.post(endpoints.SUPPORT_CREATE, data),
  getSupportById: (id) => axiosInstance.get(endpoints.SUPPORT_READ(id)),
  updateSupport: (id, data) =>
    axiosInstance.put(endpoints.SUPPORT_UPDATE(id), data),
  partialUpdateSupport: (id, data) =>
    axiosInstance.patch(endpoints.SUPPORT_PARTIAL_UPDATE(id), data),
  deleteSupport: (id) => axiosInstance.delete(endpoints.SUPPORT_DELETE(id)),
  replyToSupportMessage: (id, data) =>
    axiosInstance.post(endpoints.SUPPORT_REPLY(id), data),
  sendResetLink: (email) =>
    axiosInstance.post(endpoints.PASSWORD_RESET, { email }),

  // User
  loginUser: (data) => axiosInstance.post(endpoints.USER_LOGIN, data),
  getUserProfile: () => axiosInstance.get(endpoints.USER_PROFILE_LIST),
  updateUserProfile: (data) =>
    axiosInstance.put(endpoints.USER_PROFILE_UPDATE, data),
  registerUser: (data) => axiosInstance.post(endpoints.USER_REGISTER, data),
  refreshToken: (data) =>
    axiosInstance.post(endpoints.USER_TOKEN_REFRESH, data),
  getUsersList: () => axiosInstance.get(endpoints.USER_USERS_LIST),
  createUser: (data) => axiosInstance.post(endpoints.USER_USERS_CREATE, data),
  getUserById: (id) => axiosInstance.get(endpoints.USER_USERS_READ(id)),
  updateUser: (id, data) =>
    axiosInstance.put(endpoints.USER_USERS_UPDATE(id), data),
  partialUpdateUser: (id, data) =>
    axiosInstance.patch(endpoints.USER_USERS_PARTIAL_UPDATE(id), data),
  deleteUser: (id) => axiosInstance.delete(endpoints.USER_USERS_DELETE(id)),

  // Buildings
  getBuildingsList: () => axiosInstance.get(endpoints.BUILDINGS_LIST),
  getBuildingById: (id) => axiosInstance.get(endpoints.BUILDINGS_READ(id)),

  // Metrics
  getAdminMetrics: () => axiosInstance.get(endpoints.METRICS_ADMIN_LIST),
  getAitusaMetrics: () => axiosInstance.get(endpoints.METRICS_AITUSA_LIST),

  // Rooms
  getRoomsList: () => axiosInstance.get(endpoints.ROOMS_LIST),
  getRoomById: (id) => axiosInstance.get(endpoints.ROOMS_READ(id)),
  getRoommatesInfo: (id) =>
    axiosInstance.get(endpoints.ROOMS_ROOMMATES_INFO(id)),

  // My application
  getMyApplications: () => axiosInstance.get(endpoints.APPLICATIONS_MY),
  getMyRoommate: () => axiosInstance.get(endpoints.APPLICATIONS_MY_ROOMMATE),
  getSignedContracts: () => axiosInstance.get("api/applications/signed/"),
  getAllContracts: () => axiosInstance.get("api/applications/contracts/"),
};

export { axiosInstance, endpoints, api };
