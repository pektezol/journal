import React, { useEffect, useState } from "react";

import { api_get_folders, api_get_notes, api_get_tasks, api_update_note, api_update_task } from "../api/api";
import { Folder, FolderNote, Note, Task } from "../api/types";
import { Button, Card, Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import FolderList from "../components/FolderList";
import NoteView from "../components/NoteView";
import CreateFolder from "../components/forms/CreateFolder";
import CreateNote from "../components/forms/CreateNote";
import UpdateFolder from "../components/forms/UpdateFolder";
import UpdateNote from "../components/forms/UpdateNote";
import { useNavigate } from "react-router-dom";
import TaskList from "../components/TasksList";
import CreateTask from "../components/forms/CreateTask";
import UpdateTask from "../components/forms/UpdateTask";


const Journal: React.FC = () => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [folderNotes, setFolderNotes] = useState<FolderNote[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note>();
    const [tasks, setTasks] = useState<Task[] | undefined>(undefined);
    const [selectedTask, setSelectedTask] = useState<Task>();
    const [viewSelectedTask, setViewSelectedTask] = useState<boolean>(false);

    const [createFolderDialog, setCreateFolderDialog] = useState(false);
    const [createNoteDialog, setCreateNoteDialog] = useState(false);
    const [createTaskDialog, setCreateTaskDialog] = useState(false);

    const [updateFolderDialog, setUpdateFolderDialog] = useState<boolean>(false);
    const [updateFolder, setUpdateFolder] = useState<FolderNote>();
    const [updateNoteDialog, setUpdateNoteDialog] = useState<boolean>(false);
    const [updateNote, setUpdateNote] = useState<Note>();
    const [updateTaskDialog, setUpdateTaskDialog] = useState<boolean>(false);
    const [updateTask, setUpdateTask] = useState<Task>();

    const navigate = useNavigate();

    useEffect(() => {
        _fetch_notes();
        _fetch_folders();
        _fetch_tasks();
    }, []);

    const _fetch_folders = async () => {
        try {
            const data = await api_get_folders();
            setFolders(data);
        } catch (error) {
            console.error("error fetching folders:", error);
            navigate("/login");
        }
    };

    const _fetch_notes = async () => {
        try {
            const data = await api_get_notes();
            setFolderNotes(data);
        } catch (error) {
            console.error("error fetching notes:", error);
            navigate("/login");
        }
    };

    const _fetch_tasks = async () => {
        try {
            const data = await api_get_tasks();
            setTasks(data);
        } catch (error) {
            console.error("error fetching tasks:", error);
            navigate("/login");
        }
    };

    // useEffect(() => { }, [updateFolderDialog, updateFolder]);
    // useEffect(() => { }, [updateNoteDialog, updateNote]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={3}>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                localStorage.removeItem("token");
                                navigate("/login");
                            }}
                        >
                            Logout
                        </Button>
                    </Grid>
                    <Grid item xs={2} />
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setCreateTaskDialog(true);
                            }}
                            fullWidth>
                            New Task
                        </Button>
                        <CreateTask
                            open={createTaskDialog}
                            onClose={() => {
                                setCreateTaskDialog(false);
                                _fetch_tasks();
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Card
                            variant="outlined"
                            sx={{
                                overflowY: "auto",
                            }} >
                            <TaskList
                                tasks={tasks}
                                onRefresh={() => {
                                    _fetch_tasks();
                                }}
                                onViewTask={(task) => {
                                    setSelectedTask(task);
                                    setViewSelectedTask(true);
                                }}
                                onEditTask={(task) => {
                                    setUpdateTask(task);
                                    setUpdateTaskDialog(true);
                                }} />
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={3}>
                <Grid container spacing={1}>
                    {updateFolderDialog && updateFolder && (
                        <UpdateFolder
                            currentFolder={updateFolder}
                            folders={folders}
                            open={updateFolderDialog}
                            onClose={() => {
                                setUpdateFolderDialog(false);
                                _fetch_notes();
                                _fetch_folders();
                            }}
                        />
                    )}
                    {updateNoteDialog && updateNote && (
                        <UpdateNote
                            currentNote={updateNote}
                            folders={folders}
                            open={updateNoteDialog}
                            onClose={() => {
                                setUpdateNoteDialog(false);
                            }}
                            onUpdate={(updatedNote) => {
                                _fetch_notes();
                                _fetch_folders();
                                setSelectedNote(updatedNote);
                            }}
                        />
                    )}
                    {updateTaskDialog && updateTask && (
                        <UpdateTask
                            currentTask={updateTask}
                            open={updateTaskDialog}
                            onClose={() => {
                                setUpdateTaskDialog(false);
                            }}
                            onUpdate={() => {
                                _fetch_tasks();
                            }}
                        />
                    )}
                    {viewSelectedTask && selectedTask && (
                        <Dialog 
                            open={viewSelectedTask}
                            onClose={() => {
                                setViewSelectedTask(false);
                            }}>
                            <DialogTitle>{selectedTask.title}</DialogTitle>
                            <DialogContent dividers>
                            {selectedTask.description}
                            </DialogContent>
                        </Dialog>
                    )}
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setCreateFolderDialog(true);
                            }}
                            fullWidth>
                            New Folder
                        </Button>
                        <CreateFolder
                            folders={folders}
                            open={createFolderDialog}
                            onClose={() => {
                                setCreateFolderDialog(false);
                                _fetch_notes();
                                _fetch_folders();
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setCreateNoteDialog(true);
                            }}
                            fullWidth>
                            New Note
                        </Button>
                        <CreateNote
                            folders={folders}
                            open={createNoteDialog}
                            onClose={() => {
                                setCreateNoteDialog(false);
                                _fetch_notes();
                                _fetch_folders();
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Card
                            variant="outlined"
                            sx={{
                                overflowY: "auto",
                            }} >
                            {folderNotes.map((folder) => (
                                <FolderList
                                    key={folder.id}
                                    folder={folder}
                                    onNoteSelect={(note) => {
                                        setSelectedNote(note)
                                    }}
                                    onRefresh={() => {
                                        _fetch_notes();
                                        _fetch_folders();
                                    }}
                                    onEditFolder={(folder) => {
                                        setUpdateFolder(folder);
                                        setUpdateFolderDialog(true);
                                    }}
                                    onEditNote={(note) => {
                                        setUpdateNote(note);
                                        setUpdateNoteDialog(true);
                                    }}
                                />
                            ))}
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={6} sx={{
                height: "95vh",
                overflowY: "scroll",
            }}>
                {
                    selectedNote &&
                    <>
                        <h1>{selectedNote?.title}</h1>
                        <NoteView
                            selectedNote={selectedNote} />
                    </>
                }

            </Grid>
        </Grid>
    );
};

export default Journal;
