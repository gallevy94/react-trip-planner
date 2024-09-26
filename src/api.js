import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://node128.codingbc.com:8086/",
});

// Add a request interceptor to include JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createApi = () => {
  return {
    createUser: (username, password) => {
      return api
        .post(
          "/user",
          {
            username,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getToken: (username, password) => {
      return api
        .post(
          "/authenticate",
          {
            username,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getTripPlan: (location, startDate, endDate, userId) => {
      return api
        .post(
          "/trip/trip-plan",
          null,
          {
            params: {
              location,
              startDate,
              endDate,
              userId,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getUserTrips: (userId) => {
      return api
        .post(
          "/trip/userTrips",
          { userId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.log("Error fetching user trips:", error);
        });
    },
  };
};
