import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Game {
    id: bigint;
    title: string;
    description: string;
    gameType: string;
    image?: ExternalBlob;
}
export interface Story {
    id: bigint;
    title: string;
    readingTime: bigint;
    content: string;
    author: string;
    coverImage?: ExternalBlob;
    ageGroup: AgeGroup;
}
export interface EducationalModule {
    id: bigint;
    title: string;
    contentType: string;
    learningItems: Array<string>;
    description: string;
}
export interface Poem {
    id: bigint;
    title: string;
    content: string;
    author: string;
    image?: ExternalBlob;
    ageGroup: AgeGroup;
}
export interface UserProfile {
    name: string;
}
export enum AgeGroup {
    ages3to5 = "ages3to5",
    ages6to8 = "ages6to8",
    allAges = "allAges",
    ages9to12 = "ages9to12"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEducationalModule(title: string, description: string, contentType: string, learningItems: Array<string>): Promise<bigint>;
    addGame(title: string, description: string, gameType: string, image: ExternalBlob | null): Promise<bigint>;
    addPoem(title: string, content: string, author: string, ageGroup: AgeGroup, image: ExternalBlob | null): Promise<bigint>;
    addStory(title: string, content: string, author: string, ageGroup: AgeGroup, readingTime: bigint, coverImage: ExternalBlob | null): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteEducationalModule(id: bigint): Promise<void>;
    deleteGame(id: bigint): Promise<void>;
    deletePoem(id: bigint): Promise<void>;
    deleteStory(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEducationalModule(id: bigint): Promise<EducationalModule>;
    getGame(id: bigint): Promise<Game>;
    getPoem(id: bigint): Promise<Poem>;
    getStory(id: bigint): Promise<Story>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listEducationalModules(): Promise<Array<EducationalModule>>;
    listGames(): Promise<Array<Game>>;
    listPoems(): Promise<Array<Poem>>;
    listPoemsByAgeGroup(ageGroup: AgeGroup): Promise<Array<Poem>>;
    listStories(): Promise<Array<Story>>;
    listStoriesByAgeGroup(ageGroup: AgeGroup): Promise<Array<Story>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateEducationalModule(id: bigint, title: string, description: string, contentType: string, learningItems: Array<string>): Promise<void>;
    updateGame(id: bigint, title: string, description: string, gameType: string, image: ExternalBlob | null): Promise<void>;
    updatePoem(id: bigint, title: string, content: string, author: string, ageGroup: AgeGroup, image: ExternalBlob | null): Promise<void>;
    updateStory(id: bigint, title: string, content: string, author: string, ageGroup: AgeGroup, readingTime: bigint, coverImage: ExternalBlob | null): Promise<void>;
    uploadImage(image: ExternalBlob): Promise<ExternalBlob>;
}
