import dayjs from "dayjs"

export default (date?: string) => {
    return date ? dayjs(date).format('DD MMMM YYYY HH:mm ') + userTimezone() : '-'
}
