export const dateFormat = (date: string | number | Date, local: Intl.LocalesArgument = 'pt-BR', options: Intl.DateTimeFormatOptions = {timeZone: "UTC"})=>{
    return (new Date(date)).toLocaleDateString(local, options)
}
