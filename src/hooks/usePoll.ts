import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import type { PollData } from "../types";
import { getPollById } from "../api/polls";

export const useGetPoll = (id: string) =>
  useQuery({
    queryKey: ["poll", id],
    queryFn: () => getPollById(id!),
  });

export const useCreatePoll = () =>
  useMutation({
    mutationFn: async (data: PollData) => {
      const res = await api.post("/polls", data);
      return res.data;
    },
  });

export const useEditPoll = (id: string) =>
  useMutation({
    mutationFn: async (data: Partial<PollData>) => {
      const res = await api.patch(`/polls/${id}`, data);
      return res.data;
    },
  });

export const useDeletePoll = () =>
  useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/polls/${id}`);
      return res.data;
    },
  });
