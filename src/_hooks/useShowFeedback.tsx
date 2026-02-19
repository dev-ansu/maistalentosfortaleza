import { ShowFeedback } from "@/_components/ui/ShowFeedback/ShowFeedback";
import { Button } from "@chakra-ui/react";
import { useState } from "react"

interface OptionsProps{
    title?: string;
}

export const useShowFeedback = ()=>{
    const [open, setOpen] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [options, setOptions] = useState<OptionsProps | null>();

    const handleOpen = (feedbackValue: string, options?: OptionsProps | null)=>{
        setFeedback(feedbackValue);
        setOpen(true)
        setOptions(options);
    }

    const ShowFeedbackDialog = (
        <ShowFeedback
            title={options?.title}
            open={open}
            setOpen={setOpen}
            feedback={feedback}
        />
    )

    return { handleOpen, ShowFeedbackDialog };
}