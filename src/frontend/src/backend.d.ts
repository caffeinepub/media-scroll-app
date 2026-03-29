import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MediaItem {
    id: bigint;
    title: string;
    sortOrder: bigint;
    createdAt: bigint;
    description: string;
    blobId: string;
    mediaType: string;
}
export interface UserProfile {
    name: string;
}
export interface AppSettings {
    theme: string;
    appName: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createMediaItem(input: MediaItem): Promise<bigint>;
    deleteMediaItem(id: bigint): Promise<void>;
    getAllMediaItems(): Promise<Array<MediaItem>>;
    getAppSettings(): Promise<AppSettings>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    reorderMediaItems(orderList: Array<[bigint, bigint]>): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAppSettings(newSettings: AppSettings): Promise<void>;
    updateMediaItem(id: bigint, mediaItem: MediaItem): Promise<void>;
}
