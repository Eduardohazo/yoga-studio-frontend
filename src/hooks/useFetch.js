import { useState, useEffect } from 'react';

const useFetch = (apiFn, deps = []) => {
 const [data, setData] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 useEffect(() => {
 setLoading(true);
 apiFn()
 .then((res) => setData(res.data.data))
 .catch((err) => setError(err.response?.data?.message || 'Error'))
 .finally(() => setLoading(false));
 }, deps);

 return { data, loading, error };
};

export default useFetch;