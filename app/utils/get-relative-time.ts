import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id'; // or any other locale you prefer

dayjs.extend(relativeTime);
dayjs.locale('id');

export default (datetime: string) => {
    return dayjs(datetime).fromNow();
}
