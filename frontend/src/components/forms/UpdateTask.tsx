import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { api_update_note, api_update_task } from "../../api/api";
import { Folder, Note, Task } from "../../api/types";

interface UpdateTaskProps {
    currentTask: Task;
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const UpdateTask: React.FC<UpdateTaskProps> = ({ currentTask, open, onClose, onUpdate }) => {
    const [newTaskTitle, setNewTaskTitle] = useState<string>(currentTask.title);
    const [newTaskDescription, setNewTaskDescription] = useState<string>(currentTask.description);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Update Note
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    label="Task Title"
                    value={newTaskTitle}
                    onChange={(e) => {
                        setNewTaskTitle(e.target.value)
                    }}
                    fullWidth
                    required
                />
                <hr />
                <TextField
                    label="Task Description"
                    value={newTaskDescription}
                    onChange={(e) => {
                        setNewTaskDescription(e.target.value)
                    }}
                    fullWidth
                    multiline
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    if (newTaskTitle == "") {
                        alert("Specify a title for the updated task.");
                    } else {
                        const updatedTask: Task = {
                            ...currentTask,
                            title: newTaskTitle,
                            description: newTaskDescription,
                        }
                        api_update_task(updatedTask);
                        alert("Task updated successfully!");
                        onUpdate();
                        onClose();
                    }
                }} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateTask;
