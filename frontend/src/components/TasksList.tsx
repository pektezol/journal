import React, { useState } from "react";
import { FolderNote, Note, Task } from '../api/types';
import {
  Box,
  List,
  ListItemText,
  ListItemIcon,
  IconButton,
  Collapse,
  ListItemButton,
  ListItem,
  Checkbox,
  Dialog,
  DialogTitle,
} from "@mui/material";
import {
  Folder as FolderIcon,
  Note as NoteIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { api_delete_folder, api_delete_note, api_delete_task, api_update_task } from "../api/api";

interface TaskListProps {
  tasks?: Task[];
  onRefresh: () => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onRefresh, onViewTask, onEditTask }) => {
  if (!tasks) {
    return <></>;
  }

  const _update_task = async (task: Task) => {
    await api_update_task({
      ...task,
      finished: !task.finished,
    });
    onRefresh();
  }

  return (
    <>
      <List>
        {tasks.map((task) => (
          <>
            <ListItem
              key={task.id}
              disablePadding
            >
              <ListItemButton dense onClick={() => {
                _update_task(task);
              }} sx={{
                "&:hover .folder-icons": {
                  visibility: "visible",
                },
              }}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={task.finished}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={task.title} sx={{textDecoration: task.finished ? "line-through" : ""}}/>
                <Box className="folder-icons" sx={{ visibility: "hidden" }}>
                <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewTask(task);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <ViewIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTask(task);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Are you sure you want to delete this task? This action is permanent.")) {
                        api_delete_task(task.id);
                        alert("Task deleted successfully!");
                        onRefresh();
                      }
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <DeleteIcon />
                  </IconButton>

                </Box>
              </ListItemButton>
            </ListItem>
            <hr />
          </>
        ))}
      </List>
    </>
  )
};

export default TaskList;
