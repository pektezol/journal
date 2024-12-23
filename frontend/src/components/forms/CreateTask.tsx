import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { api_create_note, api_create_task } from "../../api/api";
import { Folder } from "../../api/types";

interface CreateTaskProps {
    open: boolean;
    onClose: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ open, onClose }) => {
    const [newTaskTitle, setNewTaskTitle] = useState<string>("");
    const [newTaskDescription, setNewTaskDescription] = useState<string >("");

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Create Task
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
                    onChange={(e) => {
                        setNewTaskTitle(e.target.value)
                    }}
                    fullWidth
                    required
                />
                <hr />
                <TextField
                    label="Task Description"
                    onChange={(e) => {
                        setNewTaskDescription(e.target.value)
                    }}
                    fullWidth
                    multiline
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    if (newTaskTitle === "") {
                        alert("Specify a title for the new task.");
                    } else {
                        api_create_task(newTaskTitle, newTaskDescription);
                        alert("Task created successfully!");
                        onClose();
                    }
                }} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateTask;
