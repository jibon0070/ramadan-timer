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

const separator = ':';

function number_padding(num) {
    return num < 10 ? '0' + num : num;
}

function date_format(date) {
    return date.getFullYear() + '-' + number_padding(date.getMonth() + 1) + '-' + number_padding(date.getDate());
}

function time_format(time, show_second = false) {
    let hour = number_padding(time.getHours() % 12);
    let minute = number_padding(time.getMinutes());
    let second = number_padding(time.getSeconds());
    return `${hour == '00' ? '12' : hour}${separator}${minute}${show_second ? separator + second : ''} ${time.getHours() >= 12 ? 'PM' : 'AM'}`;
}

addEventListener('DOMContentLoaded', () => {
    function main() {
        let current_date = new Date();
        const start_date = new Date(Object.keys(data)[0]);
        const end_date = new Date(Object.keys(data)[Object.keys(data).length - 1]);
        if (current_date < start_date) {
            current_date = date_format(start_date);
        } else if (current_date > end_date) {
            window.close();
        } else {
            current_date = date_format(current_date);
        }
        let [sehri, iftar] = data[current_date];
        sehri = new Date(current_date + ' ' + sehri).getTime();
        iftar = new Date(current_date + ' ' + iftar).getTime();
        const time = new Date().getTime();
        const status_element = document.querySelector('#status');
        let remaining;
        if (time < sehri) {
            remaining = sehri - time;
            status_element.innerText = `Sehri Time ${time_format(new Date(sehri))}`;
        } else {
            remaining = iftar - time;
            status_element.innerText = `Iftar Time ${time_format(new Date(iftar))}`;
        }
        const seconds = Math.floor(remaining / 1000) % 60;
        const minutes = Math.floor(remaining / (1000 * 60)) % 60;
        const hours = Math.floor(remaining / (1000 * 60 * 60)) % 24;
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const day_element = document.querySelector('#day');
        const hour_element = document.querySelector('#hour');
        const minute_element = document.querySelector('#minute');
        const second_element = document.querySelector('#second');
        if (days == 0) {
            day_element.innerText = '';
        } else {
            day_element.innerText = number_padding(days) + separator;
        }
        if(days == 0 && hours == 0) {
            hour_element.innerText = '';
        } else {
            hour_element.innerText = number_padding(hours) + separator;
        }
        if(days == 0 && hours == 0 && minutes == 0) {
            minute_element.innerText = '';
        } else {
            minute_element.innerText = number_padding(minutes) + separator;
        }
        if(days == 0 && hours == 0 && minutes == 0 && seconds == 0) {
            second_element.innerText = '';
        } else {
            second_element.innerText = number_padding(seconds);
        }
        document.querySelector('#time').innerText = time_format(new Date(time), true);
    }
    main();
    setInterval(main, 1000);
})