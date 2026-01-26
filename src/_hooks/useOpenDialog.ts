import { useState } from "react"

export const useOpenDialog = ()=>{
    const [open, setOpen] = useState(false);

    const handleOpenDialog = (o: boolean)=>{
        setOpen(true);        
    }

    return { open, handleOpenDialog}
}