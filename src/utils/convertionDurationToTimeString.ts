export function convertDurationToTimeString(duration: number): string {

    const hour = Math.floor(duration / 3600) // Math.floor para arredondar para baixo.
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = duration % 60

    const timeString = [hour, minutes, seconds].map(x => String(x).padStart(2, '0')).join(':')

    return timeString;
}