import axios from "axios";
import useSWR from "swr";
import useUser from "./useUser";

const useSingleFetch = url => {
  const user = useUser();
  const options = user
    ? {
        headers: { Authorization: `Token ${user.token}` },
      }
    : {};
  const fetcher = async _ => {
    const res = await (await axios.get(_, options)).data.data;

    return res;
  };
  const { data, mutate, error } = useSWR(url, fetcher);
  return {
    data,
    mutate,
    isError: error,
    isLoading: !data,
  };
};

export default useSingleFetch;
