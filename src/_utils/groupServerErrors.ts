export const groupServerErrors = (errors: any)=>{
    const grouped = errors.reduce((acc: Record<string, string[]>, err: any) => {
    if (!acc[err.path]) acc[err.path] = [];
        acc[err.path].push(err.msg);
        return acc;
    }, {});
    return grouped;
}