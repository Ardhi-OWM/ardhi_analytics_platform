// types.ts
export interface FileType {
    file: File;
    name: string;
    size: number;
    progress: number;
    error?: boolean;
    uploaded: boolean;
}
