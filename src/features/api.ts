import axios, { type AxiosResponse } from "axios";
import type { DataPage, MetaSchema } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});


export async function getData<TData = Record<string, unknown>>(
  page: number,
  perPage: number
): Promise<DataPage<TData>> {
  const response: AxiosResponse<DataPage<TData>> = await api.get("/data", {
    params: { _page: page, _per_page: perPage },
  });
  return response.data;
}

export async function getMeta(): Promise<MetaSchema> {
  const response: AxiosResponse<MetaSchema> = await api.get("/meta");
  return response.data;
}



export async function createRecord(
  payload: Record<string, unknown>
) {
  console.log(payload)
  const res = await api.post("/data", payload);
  return res.data;
}