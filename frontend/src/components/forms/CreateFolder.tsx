import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { api_create_folder } from "../../api/api";
import { Folder } from "../../api/types";

interface CreateFolderProps {
    folders: Folder[];
    open: boolean;
    onClose: () => void;
}

const CreateFolder: React.FC<CreateFolderProps> = ({ folders, open, onClose }) => {
    const [newFolderName, setNewFolderName] = useState<string>("");
    const [parentID, setParentID] = useState<number>(0);

    useEffect(() => {
        setParentID(0);
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Create Folder
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
                        alert("Specify a name for the new folder.");
                    } else {
                        api_create_folder(newFolderName, parentID);
                        alert("Folder created successfully!")
                        onClose();
                    }
                }} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateFolder;
