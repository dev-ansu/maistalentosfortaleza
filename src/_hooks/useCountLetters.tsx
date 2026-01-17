import { useState } from "react"

export const maxLetters = 2500;

export const useCountLetters = ()=>{
    const [countLetters, setCountLetters] = useState(0);
    
    return {countLetters, setCountLetters}
}