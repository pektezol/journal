import React, { useEffect, useState, useRef } from "react";
import { Note } from "../api/types";
import { TextField } from "@mui/material";
import { api_update_note } from "../api/api";

interface NoteViewProps {
    selectedNote?: Note;
}


const NoteView: React.FC<NoteViewProps> = ({ selectedNote }) => {
    const [currentNote, setCurrentNote] = useState<Note>();
    const isInitialLoad = useRef(true); // Ref to track initial load


    useEffect(() => {
        if (selectedNote) {
            setCurrentNote(selectedNote);
            isInitialLoad.current = true;
        }
    }, [selectedNote]);

    useEffect(() => {
        if (!isInitialLoad.current && currentNote) {
            api_update_note(currentNote);
        } else {
            isInitialLoad.current = false;
        }
    }, [currentNote]);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (currentNote) {
            setCurrentNote({
                ...currentNote,
                note: event.target.value,
            });
        }
    };

    return (
        currentNote

            ? (
                <TextField
                    value={currentNote?.note || ""}
                    variant="outlined"
                    fullWidth
                    multiline
                    onChange={handleInputChange}
                // minRows={20}
                />
            )

            : (
                <></>
            )
    );
};

export default NoteView;