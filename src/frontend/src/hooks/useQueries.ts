import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AppSettings, MediaItem } from "../backend";
import { useActor } from "./useActor";

export function useMediaItems() {
  const { actor, isFetching } = useActor();
  return useQuery<MediaItem[]>({
    queryKey: ["mediaItems"],
    queryFn: async () => {
      if (!actor) return [];
      const items = await actor.getAllMediaItems();
      return [...items].sort((a, b) => Number(a.sortOrder - b.sortOrder));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAppSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<AppSettings>({
    queryKey: ["appSettings"],
    queryFn: async () => {
      if (!actor) return { theme: "dark", appName: "Media Scroll" };
      return actor.getAppSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateMediaItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: MediaItem) => {
      if (!actor) throw new Error("Not connected");
      return actor.createMediaItem(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaItems"] });
    },
  });
}

export function useUpdateMediaItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, item }: { id: bigint; item: MediaItem }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateMediaItem(id, item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaItems"] });
    },
  });
}

export function useDeleteMediaItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteMediaItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaItems"] });
    },
  });
}

export function useReorderMediaItems() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderList: Array<[bigint, bigint]>) => {
      if (!actor) throw new Error("Not connected");
      return actor.reorderMediaItems(orderList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaItems"] });
    },
  });
}

export function useUpdateAppSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: AppSettings) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateAppSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appSettings"] });
    },
  });
}
