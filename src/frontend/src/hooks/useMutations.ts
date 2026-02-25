import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { Poem, Story, Game, EducationalModule, ExternalBlob, AgeGroup } from "../backend";

// Poem Mutations
export function useAddPoem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      author: string;
      ageGroup: AgeGroup;
      image: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addPoem(
        data.title,
        data.content,
        data.author,
        data.ageGroup,
        data.image
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["poems"] });
    },
  });
}

export function useUpdatePoem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      content: string;
      author: string;
      ageGroup: AgeGroup;
      image: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updatePoem(
        data.id,
        data.title,
        data.content,
        data.author,
        data.ageGroup,
        data.image
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["poems"] });
    },
  });
}

export function useDeletePoem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deletePoem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["poems"] });
    },
  });
}

// Story Mutations
export function useAddStory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      author: string;
      ageGroup: AgeGroup;
      readingTime: bigint;
      coverImage: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addStory(
        data.title,
        data.content,
        data.author,
        data.ageGroup,
        data.readingTime,
        data.coverImage
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });
}

export function useUpdateStory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      content: string;
      author: string;
      ageGroup: AgeGroup;
      readingTime: bigint;
      coverImage: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateStory(
        data.id,
        data.title,
        data.content,
        data.author,
        data.ageGroup,
        data.readingTime,
        data.coverImage
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });
}

export function useDeleteStory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteStory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });
}

// Game Mutations
export function useAddGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      gameType: string;
      image: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addGame(
        data.title,
        data.description,
        data.gameType,
        data.image
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useUpdateGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      gameType: string;
      image: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateGame(
        data.id,
        data.title,
        data.description,
        data.gameType,
        data.image
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useDeleteGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteGame(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

// Educational Module Mutations
export function useAddEducationalModule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      contentType: string;
      learningItems: string[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addEducationalModule(
        data.title,
        data.description,
        data.contentType,
        data.learningItems
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educational-modules"] });
    },
  });
}

export function useUpdateEducationalModule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      contentType: string;
      learningItems: string[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateEducationalModule(
        data.id,
        data.title,
        data.description,
        data.contentType,
        data.learningItems
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educational-modules"] });
    },
  });
}

export function useDeleteEducationalModule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteEducationalModule(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educational-modules"] });
    },
  });
}
