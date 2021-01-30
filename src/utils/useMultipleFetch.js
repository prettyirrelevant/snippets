import axios from "axios";
import useSWR from "swr";

const useMultipleFetch = url => {
  const fetcher = async _ => {
    const res = await (await axios.get(_)).data.data;
    return res;
  };
  const { data, error } = useSWR(url, fetcher);

  return {
    data,
    isError: error,
    isLoading: !data,
  };
};

export default useMultipleFetch;
