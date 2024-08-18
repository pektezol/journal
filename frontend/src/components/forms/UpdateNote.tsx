import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { api_update_note } from "../../api/api";
import { Folder, Note } from "../../api/types";

interface UpdateNoteProps {
    currentNote: Note;
    folders: Folder[];
    open: boolean;
    onClose: () => void;
}

const UpdateNote: React.FC<UpdateNoteProps> = ({ currentNote, folders, open, onClose }) => {
    const [newNoteTitle, setNewNoteTitle] = useState<string>(currentNote.title);
    const [newNoteFolderID, setNewNoteFolderID] = useState<number>(currentNote.folder);

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
                    label="Note Title"
                    value={newNoteTitle}
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
                        alert("Specify a title for the updated note.");
                    } else if (newNoteFolderID == null) {
                        alert("Select a folder for the updated note.");
                    } else {
                        api_update_note({
                            ...currentNote,
                            title: newNoteTitle,
                            folder: newNoteFolderID,
                        });
                        alert("Note updated successfully!");
                        onClose();
                    }
                }} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateNote;
