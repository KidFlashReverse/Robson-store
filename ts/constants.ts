import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

export const defaultTitle = {
    fontFamily: '"Roboto", sans-serif',
    color: '#394B58',
    fontWeight: '600',
};

export const defaultSubTitle = {
    fontFamily: '"Roboto", sans-serif',
    color: '#394B58',
    fontWeight: '400',
};

export const defaultText = {
    fontFamily: '"Roboto", sans-serif',
    color: '#394B58',
    fontWeight: '200',
};

export const fullDate = (date: Timestamp | undefined) => {
    if(!date) return null;
    
    const data = dayjs(date.toDate()).format('DD/MM/YYYY');
    const horas = dayjs(date.toDate()).format('HH:mm');

    return `${data} às ${horas}`;
}