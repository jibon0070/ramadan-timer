import './timer.scss';
import {Component} from "react";

export default class Timer extends Component{
    render() {
        return (
            <div className="timer" ref={this.props.screen_ref}>
                <div className="status">{this.props.status}</div>
                <div className="time_remaining" ref={this.props.timer_ref}>{this.props.time_remaining}</div>
                <div className="clock" ref={this.props.clock_ref}>{this.props.clock}</div>
            </div>
        )
    }
}