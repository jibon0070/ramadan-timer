import {Component} from "react";
import './notification.scss';

export default class Notification extends Component {
    render() {
        return (
            <div className='notification'>
                {this.props.content}
            </div>
        );
    }
};