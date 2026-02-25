import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { Poem, Story, Game, EducationalModule } from "../backend";

export function useListPoems() {
  const { actor, isFetching } = useActor();
  return useQuery<Poem[]>({
    queryKey: ["poems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPoems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPoem(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Poem>({
    queryKey: ["poem", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getPoem(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useListStories() {
  const { actor, isFetching } = useActor();
  return useQuery<Story[]>({
    queryKey: ["stories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listStories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStory(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Story>({
    queryKey: ["story", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getStory(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useListGames() {
  const { actor, isFetching } = useActor();
  return useQuery<Game[]>({
    queryKey: ["games"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listGames();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListEducationalModules() {
  const { actor, isFetching } = useActor();
  return useQuery<EducationalModule[]>({
    queryKey: ["educational-modules"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEducationalModules();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEducationalModule(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<EducationalModule>({
    queryKey: ["educational-module", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getEducationalModule(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
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
    retry: false,
  });
}
