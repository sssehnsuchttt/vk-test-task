import axios from "axios";
import type { getTicketsType } from "./types";
import type { QueryFunctionContext } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const getData = async ({ queryKey} : QueryFunctionContext) => {
    const [_key, page, perPage] = queryKey;
    const { data } = await api.get("/tickets", {
        params: {
            _page: page,
            _per_page: perPage,
        }
    })

    
    return data;
}

export const getMeta = async () => {
    const { data } = await api.get("/meta")

    return data;
}