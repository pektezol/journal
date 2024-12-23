import axios from "axios";
import { Folder, FolderNote, Note, Task } from "./types";

export const api_login = async (username: string, password: string): Promise<string> => {
    const response = await axios.post("/api/login", {
        "username": username,
        "password": password,
    })
    return response.data.token;
};

export const api_get_folders = async (): Promise<Folder[]> => {
    const token = localStorage.getItem("token")
    const response = await axios.get("/api/folders", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return response.data.folders.map((item: { id: any; name: any; }) => ({
        id: item.id,
        name: item.name,
    }));
}

export const api_get_notes = async (): Promise<FolderNote[]> => {
    const token = localStorage.getItem("token")
    const response = await axios.get("/api/notes", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return _map_data_to_folders(response.data.folders);
}

export const api_get_tasks = async (): Promise<Task[]> => {
    const token = localStorage.getItem("token")
    const response = await axios.get("/api/tasks", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return response.data.tasks.map((item: { id: any; title: any; description: any; finished: any; }) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        finished: item.finished,
    }));
}

function _map_data_to_folders(data: any[]): FolderNote[] {
    return data.map(item => ({
        id: item.id,
        name: item.name,
        parent: item.parent,
        notes: item.notes.map((note: any) => ({
            id: note.id,
            folder: note.folder,
            title: note.title,
            note: note.note,
            created_at: note.created_at,
            updated_at: note.updated_at,
        })),
        subfolders: _map_data_to_folders(item.subfolders)
    }));
};

export const api_create_note = async (folder_id: number, note_title: string) => {
    const token = localStorage.getItem("token")
    await axios.post(`/api/notes`, {
        "folder": folder_id,
        "title": note_title,
    }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
};

export const api_update_note = async (note: Note) => {
    const token = localStorage.getItem("token")
    await axios.put(`/api/notes/${note.id}`, {
        "folder": note.folder,
        "title": note.title,
        "note": note.note,
    }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
};

export const api_create_task = async (task_title: string, task_description: string) => {
    const token = localStorage.getItem("token")
    await axios.post(`/api/tasks`, {
        "title": task_title,
        "description": task_description,
    }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
};

export const api_update_task = async (task: Task) => {
    const token = localStorage.getItem("token")
    await axios.put(`/api/tasks/${task.id}`, {
        "title": task.title,
        "description": task.description,
        "finished": task.finished,
    }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
};


export const api_create_folder = async (name: string, parent_id?: number) => {
    const token = localStorage.getItem("token")
    await axios.post(`/api/folders`, {
        "parent": parent_id ? parent_id : null,
        "name": name,
    }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
};

export const api_update_folder = async (folder: FolderNote) => {
    const token = localStorage.getItem("token")
    await axios.put(`/api/folders/${folder.id}`, {
        "parent": folder.parent ? folder.parent : null,
        "name": folder.name,
    }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
};

export const api_delete_folder = async (folder_id: number) => {
    const token = localStorage.getItem("token")
    await axios.delete(`/api/folders/${folder_id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
};

export const api_delete_note = async (note_id: number) => {
    const token = localStorage.getItem("token")
    await axios.delete(`/api/notes/${note_id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
};

export const api_delete_task = async (task_id: number) => {
    const token = localStorage.getItem("token")
    await axios.delete(`/api/tasks/${task_id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
};
