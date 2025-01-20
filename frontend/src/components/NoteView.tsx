import React, { useEffect, useState, useRef } from "react";
import { Note } from "../api/types";
import { TextField } from "@mui/material";
import { api_update_note } from "../api/api";

interface NoteViewProps {
    selectedNote?: Note;
}


const NoteView: React.FC<NoteViewProps> = ({ selectedNote }) => {
    const [currentNote, setCurrentNote] = useState<Note | undefined>(undefined);
    const [debouncedNote, setDebouncedNote] = useState<Note | undefined>(undefined);
    const isInitialLoad = useRef(true); // Ref to track initial load


    useEffect(() => {
        if (selectedNote) {
            setCurrentNote(selectedNote);
            isInitialLoad.current = true;
        }
    }, [selectedNote]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (currentNote) {
                setDebouncedNote(currentNote);
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [currentNote]);

    useEffect(() => {
        if (!isInitialLoad.current && debouncedNote) {
            api_update_note(debouncedNote);
        } else {
            isInitialLoad.current = false;
        }
    }, [debouncedNote]);

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
                    spellCheck="false"
                // minRows={20}
                />
            )

            : (
                <></>
            )
    );
};

export default NoteView;