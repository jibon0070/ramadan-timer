import {useEffect, useRef, useState} from "react";
import Xl from "read-excel-file";

const five_hours_audio = new Audio(/*"/voices/5 hours left.mp3"*/"/voices/5 hours left.mp3");
const four_hours_audio = new Audio("/voices/4 hours left.mp3")
const three_hours_audio = new Audio("/voices/3 hours left.mp3")
const two_hours_audio = new Audio("/voices/2 hours left.mp3")
const one_hour_audio = new Audio("/voices/1 hour left.mp3")
const forty_five_minutes_audio = new Audio("/voices/45 minutes left.mp3")
const thirty_minutes_audio = new Audio("/voices/30 minutes left.mp3")
const fifteen_minutes_audio = new Audio("/voices/15 minutes left.mp3")
const ten_minutes_audio = new Audio("/voices/10 minutes left.mp3")
const five_minutes_audio = new Audio("/voices/5 minutes left.mp3")
const one_minute_audio = new Audio("/voices/1 minute left.mp3")


function App() {

    const ref = {
        time: useRef<HTMLDivElement>(null),
        remaining_time: useRef<HTMLDivElement>(null)
    }

    const [remaining_time, set_remaining_time] = useState("88:88:88");
    const [time, set_time] = useState("88:88:88");
    const [info, set_info] = useState("");

    function number_padding(seconds: number) {
        return (seconds < 10 ? "0" : "") + seconds;
    }

    function get_target_time(data: number[][]): { time: number, type?: string } {
        let date = new Date();
        let current_data_row = data.filter(data => data[0] >= new Date(date_format(date)).getTime())?.[0];
        if (!current_data_row) return {time: 0}
        if (date.getTime() < current_data_row[1]) {
            return {time: current_data_row[1], type: "SEHRI"}
        } else if (date.getTime() < current_data_row[2])
            return {time: current_data_row[2], type: "IFTAR"}
        else {
            const index = data.indexOf(current_data_row);
            current_data_row = data[index + 1];
            if (date.getTime() < current_data_row[1]) {
                return {time: current_data_row[1], type: "SEHRI"}
            } else if (date.getTime() < current_data_row[2])
                return {time: current_data_row[2], type: "IFTAR"}
            return {time: 0, type: "NULL"}
        }
    }

    function calculate_time(data: number[][]) {
        const current_time = new Date();
        const target = get_target_time(data);
        const remaining_time = target.time - current_time.getTime();

        const remaining_seconds = Math.floor(remaining_time / 1000);

        if (remaining_seconds === 60 * 60 * 5) five_hours_audio.play().then();
        else if (remaining_seconds === 60 * 60 * 4) four_hours_audio.play().then();
        else if (remaining_seconds === 60 * 60 * 3) three_hours_audio.play().then();
        else if (remaining_seconds === 60 * 60 * 2) two_hours_audio.play().then();
        else if (remaining_seconds === 60 * 60) one_hour_audio.play().then();
        else if (remaining_seconds === 60 * 45) forty_five_minutes_audio.play().then();
        else if (remaining_seconds === 60 * 30) thirty_minutes_audio.play().then();
        else if (remaining_seconds === 60 * 15) fifteen_minutes_audio.play().then();
        else if (remaining_seconds === 60 * 10) ten_minutes_audio.play().then();
        else if (remaining_seconds === 60 * 5) five_minutes_audio.play().then();
        else if (remaining_seconds === 60) one_minute_audio.play().then();

        if (remaining_time < 1000 * 60 * 60) {
            if (ref.remaining_time.current) {
                (ref.remaining_time.current.children[1] as HTMLDivElement).style.fontSize = "15vw"
                // ref.remaining_time.current.style.fontSize = "15vw";
            }
            if (ref.time.current)
                ref.time.current.style.fontSize = "2em";
        } else {
            if (ref.remaining_time.current) {
                (ref.remaining_time.current.children[1] as HTMLDivElement).style.fontSize = "2em"
                // ref.remaining_time.current.style.fontSize = "15vw";
            }
            if (ref.time.current)
                ref.time.current.style.fontSize = "15vw";
        }
        if (remaining_time < 1000 * 60 * 60 * 24) {
            const target_time = new Date(target.time)
            set_info(`${target.type} TIME: ${number_padding(target_time.getHours() % 12 ?? 12)}:${number_padding(target_time.getMinutes())} ${target_time.getHours() >= 12 ? "PM" : "AM"}`)
        } else set_info("")


        const r_seconds = Math.floor(remaining_time / 1000 % 60);
        const r_minutes = Math.floor(remaining_time / (1000 * 60) % 60);
        const r_hours = Math.floor(remaining_time / (1000 * 60 * 60) % 24);
        const r_days = Math.floor(remaining_time / (1000 * 60 * 60 * 24));

        if (r_days > 0)
            set_remaining_time(`${number_padding(r_days)}:${number_padding(r_hours)}:${number_padding(r_minutes)}:${number_padding(r_seconds)}`);
        else if (r_hours > 0)
            set_remaining_time(`${number_padding(r_hours)}:${number_padding(r_minutes)}:${number_padding(r_seconds)}`);
        else if (r_minutes > 0)
            set_remaining_time(`${number_padding(r_minutes)}:${number_padding(r_seconds)}`);
        else if (r_seconds > 0)
            set_remaining_time(`${number_padding(r_seconds)}`);
        else
            set_remaining_time("00");
        const hour = current_time.getHours() % 12;
        const minute = current_time.getMinutes();
        const second = current_time.getSeconds();
        let am_pm = current_time.getHours() >= 12 ? "PM" : "AM";
        set_time(`${number_padding(hour ? hour : 12)}:${number_padding(minute)}:${number_padding(second)} ${am_pm}`);
    }

    function date_format(date: Date) {
        return `${number_padding(date.getFullYear())}-${number_padding(date.getMonth() + 1)}-${number_padding(date.getDate())}`;
    }


    useEffect(() => {
        let interval: any;
        const abortController = new AbortController();
        let wake_lock: any;
        async function main() {
            try {
                wake_lock = await (navigator as any).wakeLock.request("screen");
                window.addEventListener("focus", async () => {
                    wake_lock = await (navigator as any).wakeLock.request("screen");
                });
                window.addEventListener("blur", async () => {
                    await wake_lock.release();
                    wake_lock = null;
                })
                let data_url = `${window.location.href}datas/dhaka.xlsx`;
                let data = await fetch(data_url, {
                    signal: abortController.signal
                })
                    .then(r => r.blob())
                    .then(blob => Xl(blob))
                    .then(data => data.map((data: any) => [new Date(data[0]).getTime(), new Date(`${data[0]} ${data[1]}`).getTime(), new Date(`${data[0]} ${data[2]}`).getTime()]));
                calculate_time(data);
                interval = setInterval(() => {
                    calculate_time(data);
                }, 1000);
            } catch (e) {
                console.error(e);
            }
        }

        main().then();

        return () => {
            abortController.abort();
            clearInterval(interval);
            wake_lock?.release();
        };
    }, []);
    return (
        <div className="App" onDoubleClick={(e) => {
            e.preventDefault();
            //fullscreen
            if (document.fullscreenElement) {
                document.exitFullscreen().then();
            } else {
                document.documentElement.requestFullscreen().then();
            }
        }}>
            <div className={"time"} ref={ref.time}>{time}</div>
            <div className={"remaining-time"} ref={ref.remaining_time}>
                <div>{info}</div>
                <div>{remaining_time}</div>
            </div>
        </div>
    );
}

export default App
