import React, {PureComponent} from 'react';
import Pikaday from 'pikaday';


export default class DateRangeFilter extends PureComponent {
    constructor(props) {
        super(props);

        this.fromDatePicker = null;
        this.toDatePicker = null;

        this.onFromDateChange = this.onFromDateChange.bind(this);
        this.onToDateChange = this.onToDateChange.bind(this);
    }


    onFromDateChange(date) {
        this.props.onDateChange({
            fromDate: date,
            toDate: this.props.toDate
        });
    }


    onToDateChange(date) {
        this.props.onDateChange({
            fromDate: this.props.fromDate,
            toDate: date
        });
    }


    componentDidMount() {
        this.setDatePicker();
    }


    componentDidUpdate() {
        this.setDatePicker();
    }


    componentWillUnmount() {
        if (this.fromDatePicker) {
            this.fromDatePicker.destroy();
        }

        if (this.toDatePicker) {
            this.toDatePicker.destroy();
        }
    }


    setDatePicker() {
        // Set from date picker
        const fromParams = {
            field: document.getElementById('js-fromDate'),
            onSelect: this.onFromDateChange
        };

        if (this.props.fromMinDate) {
            fromParams.minDate = this.props.fromMinDate;
        }

        if (this.props.fromMaxDate) {
            fromParams.maxDate = this.props.fromMaxDate;
        }

        if (this.fromDatePicker) {
            if (this.props.fromMinDate) {
                this.fromDatePicker.setMinDate(this.props.fromMinDate);
            }

            if (this.props.fromMaxDate) {
                this.fromDatePicker.setMaxDate(this.props.fromMaxDate);
            }
        } else {
            this.fromDatePicker = new Pikaday(fromParams); // eslint-disable-line no-unused-vars
        }


        const toParams = {
            field: document.getElementById('js-toDate'),
            onSelect: this.onToDateChange
        };

        if (this.props.toMinDate) {
            toParams.minDate = this.props.toMinDate;
        }

        if (this.props.toMaxDate) {
            toParams.maxDate = this.props.toMaxDate;
        }

        if (this.toDatePicker) {
            if (this.props.toMinDate) {
                this.toDatePicker.setMinDate(this.props.toMinDate);
            }

            if (this.props.toMaxDate) {
                this.toDatePicker.setMaxDate(this.props.toMaxDate);
            }
        } else {
            this.toDatePicker = new Pikaday(toParams); // eslint-disable-line no-unused-vars
        }
    }

    render() {
        return (
            <div className="control is-grouped is-horizontal date-range">
                <div className="control-label">
                    <label className="label date-range__label">From</label>
                </div>
                <p className="control">
                    <input
                        id="js-fromDate"
                        type="text"
                        defaultValue={this.props.fromDate.toString()}
                        placeholder="From Date"
                        className="input date-range__input"
                    />
                </p>
                <div className="control-label">
                    <label className="label date-range__label">To</label>
                </div>
                <p className="control">
                    <input
                        id="js-toDate"
                        type="text"
                        defaultValue={this.props.toDate.toString()}
                        placeholder="To Date"
                        className="input date-range__input"
                    />
                </p>
            </div>
        );
    }
}
