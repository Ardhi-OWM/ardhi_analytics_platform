// types.ts
export interface FileType {
    name: string;
    size: number;
    progress: number;
    error?: boolean;
    uploaded: boolean;
}
