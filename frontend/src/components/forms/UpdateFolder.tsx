import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { api_update_folder } from "../../api/api";
import { Folder, FolderNote } from "../../api/types";

interface UpdateFolderProps {
    currentFolder: FolderNote;
    folders: Folder[];
    open: boolean;
    onClose: () => void;
}

const UpdateFolder: React.FC<UpdateFolderProps> = ({ currentFolder, folders, open, onClose }) => {
    const [newFolderName, setNewFolderName] = useState<string>(currentFolder.name);
    const [parentID, setParentID] = useState<number>(currentFolder.parent ? currentFolder.parent : 0);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Update Folder
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
                    label="Folder Name"
                    value={newFolderName}
                    onChange={(e) => {
                        setNewFolderName(e.target.value)
                    }}
                    fullWidth
                    required
                />
                <hr />
                <InputLabel id="label-parent">Parent</InputLabel>
                <Select
                    labelId="label-parent"
                    label="Parent"
                    value={parentID}
                    onChange={(e) => setParentID((e.target.value as number))}
                    fullWidth
                    required
                >
                    <MenuItem key={0} value={0}>*None*</MenuItem>
                    {folders.map(folder => (
                        <MenuItem key={folder.id} value={folder.id}>{folder.name}</MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    if (newFolderName == null) {
                        alert("Specify a name for the updated folder.");
                    } else {
                        api_update_folder({
                            ...currentFolder,
                            name: newFolderName,
                            parent: parentID,
                        });
                        alert("Folder updated successfully!")
                        onClose();
                    }
                }} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateFolder;
