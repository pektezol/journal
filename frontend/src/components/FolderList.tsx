import React, { useState } from "react";
import { FolderNote, Note } from '../api/types';
import {
  Box,
  List,
  ListItemText,
  ListItemIcon,
  IconButton,
  Collapse,
  ListItemButton,
} from "@mui/material";
import {
  Folder as FolderIcon,
  Note as NoteIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { api_delete_folder, api_delete_note } from "../api/api";

interface FolderListProps {
  folder: FolderNote;
  onNoteSelect: (note: Note) => void;
  onRefresh: () => void;
  onEditFolder: (folder: FolderNote) => void;
  onEditNote: (note: Note) => void;
}

const FolderList: React.FC<FolderListProps> = ({ folder, onNoteSelect, onRefresh, onEditFolder, onEditNote }) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const handleToggleFolder = (folderId: number) => {
    setOpenFolders((prevState) => ({
      ...prevState,
      [folderId]: !prevState[folderId],
    }));
  };

  const renderFolder = (folder: FolderNote, level: number = 0) => (
    <Box key={folder.id}>
      <ListItemButton
        onClick={() => handleToggleFolder(folder.id)}
        sx={{
          pl: 4 + level * 2,
          "&:hover .folder-icons": {
            visibility: "visible",
          },
          "&:before": {
            content: '""',
            position: "absolute",
            left: `${2 + level * 2}`,
            bottom: 0,
            width: `calc(100% - ${2 + level * 2}rem)`,
            height: "1px",
            backgroundColor: "#ccc",
          },
        }}
      >
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={folder.name} />
        <Box className="folder-icons" sx={{ visibility: "hidden" }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEditFolder(folder);
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Are you sure you want to delete this folder? All subfolders and notes that belong to this folder WILL ALSO be deleted. This action is permanent.")) {
                api_delete_folder(folder.id);
                alert("Folder deleted successfully!");
                onRefresh();
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
        {openFolders[folder.id] ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openFolders[folder.id]} timeout="auto" unmountOnExit>

        <List component="div" disablePadding>
          {folder.notes.map((note) => (
            <ListItemButton
              key={note.id}
              sx={{
                pl: 4 + (level + 1) * 2,
                "&:hover .note-icons": {
                  visibility: "visible",
                },
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f0f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "inherit")
              }
              onClick={() => onNoteSelect(note)}
            >
              <ListItemIcon>
                <NoteIcon />
              </ListItemIcon>
              <ListItemText primary={note.title} />
              <Box className="note-icons" sx={{ visibility: "hidden" }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditNote(note);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Are you sure you want to delete this note? This action is permanent.")) {
                      api_delete_note(note.id);
                      alert("Note deleted successfully!");
                      onRefresh();
                    }
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItemButton>
          ))}
          {folder.subfolders.map((subfolder) =>
            renderFolder(subfolder, level + 1)
          )}
        </List>
      </Collapse>
    </Box>
  );

  return <List>{renderFolder(folder)}</List>;
};

export default FolderList;
