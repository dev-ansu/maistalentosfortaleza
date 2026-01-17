import { ShowFeedback } from "@/_components/ui/ShowFeedback/ShowFeedback";
import { Button } from "@chakra-ui/react";
import { useState } from "react"


export const useShowFeedback = ()=>{
    const [open, setOpen] = useState(false);
    const [feedback, setFeedback] = useState("");

    const handleOpen = (feedbackValue: string)=>{
        setFeedback(feedbackValue);
        setOpen(true)
    }

    const ShowFeedbackDialog = (
        <ShowFeedback
            open={open}
            setOpen={setOpen}
            feedback={feedback}
        />
    )

    return { handleOpen, ShowFeedbackDialog };
}