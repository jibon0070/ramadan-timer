import './App.scss';
import Timer from "./components/timer/timer";
import {Component, createRef} from "react";
import Notification from "./components/notification/notification";


export default class App extends Component {
    is_fullscreen = false;
    handleKeyDown = (e) => {
        if (e.key === 'f' || e.key === 'ফ') {
            this.fullscreen();
        }
    };

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
        clearInterval(this.interval);
    }

    state = {
        status: '',
        clock: '',
        time_remaining: '',
    }

    fullscreen() {
        if (!this.is_fullscreen)
            document.body.requestFullscreen();
        else
            document.exitFullscreen();
        this.is_fullscreen = !this.is_fullscreen;
    };


    constructor(props) {
        super(props);
        this.clock_ref = createRef();
        this.timer_ref = createRef();
        this.data = {
            "2022-04-03": ['04:27 AM', '06:19 PM'],
            "2022-04-04": ['04:27 AM', '06:19 PM'],
            "2022-04-05": ['04:26 AM', '06:19 PM'],
            "2022-04-06": ['04:24 AM', '06:20 PM'],
            "2022-04-07": ['04:24 AM', '06:20 PM'],
            "2022-04-08": ['04:23 AM', '06:21 PM'],
            "2022-04-09": ['04:22 AM', '06:21 PM'],
            "2022-04-10": ['04:21 AM', '06:21 PM'],
            "2022-04-11": ['04:20 AM', '06:22 PM'],
            "2022-04-12": ['04:19 AM', '06:22 PM'],
            "2022-04-13": ['04:18 AM', '06:23 PM'],
            "2022-04-14": ['04:17 AM', '06:23 PM'],
            "2022-04-15": ['04:15 AM', '06:23 PM'],
            "2022-04-16": ['04:14 AM', '06:24 PM'],
            "2022-04-17": ['04:13 AM', '06:24 PM'],
            "2022-04-18": ['04:12 AM', '06:24 PM'],
            "2022-04-19": ['04:11 AM', '06:25 PM'],
            "2022-04-20": ['04:10 AM', '06:25 PM'],
            "2022-04-21": ['04:09 AM', '06:26 PM'],
            "2022-04-22": ['04:08 AM', '06:26 PM'],
            "2022-04-23": ['04:07 AM', '06:27 PM'],
            "2022-04-24": ['04:06 AM', '06:27 PM'],
            "2022-04-25": ['04:05 AM', '06:28 PM'],
            "2022-04-26": ['04:05 AM', '06:28 PM'],
            "2022-04-27": ['04:04 AM', '06:29 PM'],
            "2022-04-28": ['04:03 AM', '06:29 PM'],
            "2022-04-29": ['04:02 AM', '06:29 PM'],
            "2022-04-30": ['04:01 AM', '06:30 PM'],
            "2022-04-01": ['04:00 AM', '06:30 PM'],
            "2022-05-02": ['03:59 AM', '06:31 PM'],
            "2022-05-03": ['03:58 AM', '06:31 PM'],
        }
    }


    /**
     * @param {Date} date
     * @returns {string}
     */
    date_format(date) {
        return `${date.getFullYear()}-${this.number_padding(date.getMonth() + 1)}-${this.number_padding(date.getDate())}`;
    }


    /**
     * @param {Number} num
     * @returns {string}
     */
    number_padding(num) {
        return num < 10 ? `0${num}` : num;
    }


    /**
     * @param {Date} time
     * @param {boolean} show_seconds
     * @returns {string}
     */
    time_format(time, show_seconds = false) {
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        return `${hours > 12 ? this.number_padding(hours - 12) : this.number_padding(hours)}:${this.number_padding(minutes)}${show_seconds ? `:${show_seconds ? this.number_padding(seconds) : ''}` : ''}${hours > 12 ? ' PM' : ' AM'}`;
    }


    main() {
        let current_date = new Date();
        let start_date = new Date(Object.keys(this.data)[0]);
        let end_date = new Date(Object.keys(this.data)[Object.keys(this.data).length - 1]);
        if (current_date < start_date) {
            current_date = this.date_format(start_date);
        } else if (current_date > end_date) {
            window.close();
        } else {
            current_date = this.date_format(current_date);
        }
        let [sehri, iftar] = this.data[current_date];
        sehri = new Date(`${current_date} ${sehri}`).getTime();
        iftar = new Date(`${current_date} ${iftar}`).getTime();
        let time = new Date().getTime();
        if (time > iftar) {
            current_date = this.date_format(new Date(new Date(current_date).getTime() + 1000 * 60 * 60 * 24));
            [sehri, iftar] = this.data[current_date];
            sehri = new Date(`${current_date} ${sehri}`).getTime();
            iftar = new Date(`${current_date} ${iftar}`).getTime();
        }
        let remaining;
        if (time < sehri) {
            remaining = sehri - time;
            this.setState({status: `Sehri Time ${this.time_format(new Date(sehri))}`});
        } else {
            remaining = iftar - time;
            this.setState({status: `Iftar Time ${this.time_format(new Date(iftar))}`});
        }

        let seconds = Math.floor(remaining / 1000) % 60;
        let minutes = Math.floor(remaining / (1000 * 60)) % 60;
        let hours = Math.floor(remaining / (1000 * 60 * 60)) % 24;
        let days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        let time_remaining = "";
        if (days > 0) {
            time_remaining += `${this.number_padding(days)}:`;
        }
        if (days > 0 || hours > 0) {
            time_remaining += `${this.number_padding(hours)}:`;
        }
        if (days > 0 || hours > 0 || minutes > 0) {
            time_remaining += `${this.number_padding(minutes)}`;
        }
        if (days === 0 && hours < 1) {
            time_remaining += `:${this.number_padding(seconds)}`;
            this.setState({clock: this.time_format(new Date(time))});
            this.clock_ref.current.style.fontSize = "1em";
            this.timer_ref.current.style.fontSize = "18vw";
        } else {
            this.setState({clock: this.time_format(new Date(time), true)})
            this.clock_ref.current.style.fontSize = "18vw";
            this.timer_ref.current.style.fontSize = "1em";
        }
        this.setState({time_remaining});
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
        this.main();
        this.interval = setInterval(this.main.bind(this), 1000);
    }

    render() {
        return (<div onDoubleClick={this.fullscreen.bind(this)}>
            <Notification content='Press F or double click to view the full screen'/>
            <Timer timer_ref={this.timer_ref} clock_ref={this.clock_ref} clock={this.state.clock}
                   status={this.state.status}
                   time_remaining={this.state.time_remaining}/>
        </div>);
    }
}
