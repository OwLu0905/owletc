import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { appLocalDataDir } from "@tauri-apps/api/path";

import {
    readFile,
    BaseDirectory,
    readDir,
    stat,
    remove,
} from "@tauri-apps/plugin-fs";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any }
    ? Omit<T, "children">
    : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
    ref?: U | null;
};

export function simpleFormatSecondsToMMSS(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Get the app's local data directory
export async function getAppLocalDataDir() {
    try {
        const path = await appLocalDataDir();
        console.log("App local data directory:", path);
        return path;
    } catch (error) {
        console.error("Error getting app local data directory:", error);
        return null;
    }
}

export async function getAudioSubtitlePath(id: string) {
    try {
        const dir = await appLocalDataDir();
        const audioPath = `${dir}/data/${id}/audio.m4a`;
        const subtitlePath = `${dir}/data/${id}/subtitle.json`;
        return [audioPath, subtitlePath];
    } catch (error) {
        console.error("Error getting app local data directory:", error);
        return null;
    }
}

type FileType = "m4a" | "mp4";
export async function getAudioFile(
    id: string,
    file: FileType | undefined = "m4a",
) {
    try {
        return await readFile(`data/${id}/audio.${file}`, {
            baseDir: BaseDirectory.AppLocalData,
        });
    } catch (error) {
        console.error(error);
    }
}

export async function getSubtitleFile(id: string) {
    try {
        const contents = await readFile(`data/${id}/subtitle.json`, {
            baseDir: BaseDirectory.AppLocalData,
        });
        const decoder = new TextDecoder("utf-8");
        const jsonString = decoder.decode(contents);

        // Parse the JSON string
        const jsonData = JSON.parse(jsonString);
        return jsonData;
    } catch (error) {
        console.error(error);
    }
}

export async function getRecordHistory(audioId: string, index: string) {
    try {
        return await readDir(`data/${audioId}/${index}/`, {
            baseDir: BaseDirectory.AppLocalData,
        });
    } catch (error) {
        console.error(error);
    }
}

export async function getRecordItem(
    audioId: string,
    index: string,
    filename: string,
) {
    try {
        return await readFile(`data/${audioId}/${index}/${filename}`, {
            baseDir: BaseDirectory.AppLocalData,
        });
    } catch (error) {
        console.error(error);
    }
}
export async function getRecordItemMetadata(
    audioId: string,
    index: string,
    filename: string,
) {
    try {
        return await stat(`data/${audioId}/${index}/${filename}`, {
            baseDir: BaseDirectory.AppLocalData,
        });
    } catch (error) {
        console.error(error);
    }
}

export async function deleteRecordItem(
    audioId: string,
    index: string,
    filename: string,
) {
    try {
        return await remove(`data/${audioId}/${index}/${filename}`, {
            baseDir: BaseDirectory.AppLocalData,
        });
    } catch (error) {
        console.error(error);
    }
}
