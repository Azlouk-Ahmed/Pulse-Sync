  import { useEffect, useState } from "react";
import axios from "axios";

  export const useFetchData = (API, dependencies = [], auth) => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);

          const config = {
            headers: {},
            withCredentials: true,
          };

          if (auth) {
            const storedUser = localStorage.getItem("auth");
            const token = storedUser ? JSON.parse(storedUser)?.token : null;
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          }

          const response = await axios.get(
            import.meta.env.VITE_API_URL + API,
            config
          );

          setData(response.data);
          setError(null);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(error?.response?.data?.error || error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [API, ...dependencies, auth]);

    return { data, loading, error };
  };
