import dayjs from "dayjs"

export default (date?: string) => {
    return date ? dayjs(date).format('DD-MMM-YY HH:mm ') + timezone() : '-'
}
