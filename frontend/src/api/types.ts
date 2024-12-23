export interface FolderNote {
    id: number;
    name: string;
    parent?: number;
    notes: Note[];
    subfolders: FolderNote[];
};

export interface Folder {
    id: number;
    name: string;
};

export interface Task {
    id: number;
    title: string;
    description: string;
    finished: boolean;
};

export interface Note {
    id: number;
    folder: number;
    title: string;
    note: string;
    created_at: Date;
    updated_at: Date;
};
