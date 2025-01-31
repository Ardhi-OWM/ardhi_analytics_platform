// types.ts

export type FileType = {
    file: File;
    name: string;
    size: number;
    progress: number;
    uploaded: boolean;
    error?: boolean;
};
