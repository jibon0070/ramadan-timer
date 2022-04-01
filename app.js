const data = {
    "2022-04-03": ['04:27 AM', '06:19 PM'],
    "2022-04-04": ['04:26 AM', '06:19 PM'],
    "2022-04-05": ['04:24 AM', '06:20 PM'],
    "2022-04-06": ['04:24 AM', '06:20 PM'],
    "2022-04-07": ['04:23 AM', '06:21 PM'],
    "2022-04-08": ['04:22 AM', '06:21 PM'],
    "2022-04-09": ['04:21 AM', '06:21 PM'],
    "2022-04-10": ['04:20 AM', '06:22 PM'],
    "2022-04-11": ['04:19 AM', '06:22 PM'],
    "2022-04-12": ['04:18 AM', '06:23 PM'],
    "2022-04-13": ['04:17 AM', '06:23 PM'],
    "2022-04-14": ['04:15 AM', '06:23 PM'],
    "2022-04-15": ['04:14 AM', '06:24 PM'],
    "2022-04-16": ['04:13 AM', '06:24 PM'],
    "2022-04-17": ['04:12 AM', '06:24 PM'],
    "2022-04-18": ['04:11 AM', '06:25 PM'],
    "2022-04-19": ['04:10 AM', '06:25 PM'],
    "2022-04-20": ['04:09 AM', '06:26 PM'],
    "2022-04-21": ['04:08 AM', '06:26 PM'],
    "2022-04-22": ['04:07 AM', '06:27 PM'],
    "2022-04-23": ['04:06 AM', '06:27 PM'],
    "2022-04-24": ['04:05 AM', '06:28 PM'],
    "2022-04-25": ['04:05 AM', '06:28 PM'],
    "2022-04-26": ['04:04 AM', '06:29 PM'],
    "2022-04-27": ['04:03 AM', '06:29 PM'],
    "2022-04-28": ['04:02 AM', '06:29 PM'],
    "2022-04-29": ['04:01 AM', '06:30 PM'],
    "2022-04-30": ['04:00 AM', '06:30 PM'],
    "2022-05-01": ['03:59 AM', '06:31 PM'],
    "2022-05-02": ['03:58 AM', '06:31 PM'],
}
const separator = ":"
console.time('Load Time')
/**
 * 
 * @param {Number} number 
 * @returns {String}
 */
const number_padding = (number) => {
    if (number < 10) return '0' + number;
    return '' + number;
}
/**
 * 
 * @param {Date} date 
 * @returns {String}
 */
const date_format = (date) => {
    return `${number_padding(date.getFullYear())}-${number_padding(date.getMonth() + 1)}-${number_padding(date.getDate())}`
}
/**
 * 
 * @param {Date} time 
 * @returns {String}
 */
const time_format = (time, show_second = false) => {
    const hour = number_padding(time.getHours() % 12)
    return `${hour == '00' ? '12' : hour}:${number_padding(time.getMinutes())}${!show_second ? '' : ':'+number_padding(time.getSeconds())} ${time.getHours() < 12 ? "AM" : "PM"}`
}
addEventListener("DOMContentLoaded", () => {
    const main = () => {
        let current_date = new Date(date_format(new Date()));
        const start_date = new Date(Object.keys(data)[0]);
        const end_date = new Date(Object.keys(data)[Object.keys(data).length - 1])
        if (current_date < start_date) {
            current_date = date_format(start_date)
        }
        else if (current_date > end_date) window.close();
        else current_date = date_format(current_date)
        let [seheri, iftar] = data[current_date];
        seheri = new Date(current_date + ' ' + seheri).getTime()
        iftar = new Date(current_date + ' ' + iftar).getTime()
        const time = new Date().getTime()
        const status_element = document.querySelector('#status')
        let remaining
        if (time < seheri) {
            remaining = Math.round((seheri - time) / 1000);
            status_element.innerHTML = `remaining for sehri (${time_format(new Date(seheri))})`;
        }
        else {
            remaining = Math.round((iftar - time) / 1000)
            status_element.innerHTML = `remaining for iftar (${time_format(new Date(iftar))})`;
        }
        const second = number_padding(remaining % 60)
        const minute = number_padding(Math.floor((remaining / 60) % 60))
        const hour = number_padding(Math.floor((remaining / 60 / 60) % 24))
        const day = number_padding(Math.floor(remaining / 60 / 60 / 24))
        const day_element = document.querySelector('#day');
        if (day == '00')
            day_element.innerText = ''
        else
            day_element.innerText = day + separator
        const hour_element = document.querySelector('#hour')
        if (day == '00' && hour == '00')
            hour_element.innerHTML = ''
        else
            hour_element.innerHTML = hour + separator
        const minute_element = document.querySelector('#minute')
        if (day == '00' && hour == '00' && minute == '00')
            minute_element.innerHTML = ''
        else
            minute_element.innerHTML = minute + separator
        const second_element = document.querySelector('#second')
        second_element.innerHTML = second
        const time_element = document.querySelector('#time')
        time_element.innerHTML = time_format(new Date(), true)
    }
    main()
    setInterval(() => {
        main()
    }, 1000);
    console.timeEnd('Load Time')
})