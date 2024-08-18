import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { api_create_note } from "../../api/api";
import { Folder } from "../../api/types";

interface CreateNoteProps {
    folders: Folder[];
    open: boolean;
    onClose: () => void;
}

const CreateNote: React.FC<CreateNoteProps> = ({ folders, open, onClose }) => {
    const [newNoteTitle, setNewNoteTitle] = useState<string | null>(null);
    const [newNoteFolderID, setNewNoteFolderID] = useState<number>(0);

    useEffect(() => {
        setNewNoteFolderID(0);
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Create Note
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
                    label="Note Title"
                    onChange={(e) => {
                        setNewNoteTitle(e.target.value)
                    }}
                    fullWidth
                    required
                />
                <hr />
                <InputLabel id="label-folder">Folder</InputLabel>
                <Select
                    labelId="label-folder"
                    label="Folder"
                    value={newNoteFolderID}
                    onChange={(e) => setNewNoteFolderID((e.target.value as number))}
                    fullWidth
                    required
                >
                    {folders.map(folder => (
                        <MenuItem key={folder.id} value={folder.id}>{folder.name}</MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    if (newNoteTitle == null) {
                        alert("Specify a title for the new note.");
                    } else if (newNoteFolderID === 0) {
                        alert("Select a folder for the new note.");
                    } else {
                        api_create_note(newNoteFolderID, newNoteTitle);
                        alert("Note created successfully!");
                        onClose();
                    }
                }} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateNote;
