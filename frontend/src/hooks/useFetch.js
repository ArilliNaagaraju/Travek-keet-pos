import { useEffect, useState } from "react";

export default function useFetch(fn) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fn().then(setData).catch(() => setData(null));
  }, [fn]);
  return data;
}
