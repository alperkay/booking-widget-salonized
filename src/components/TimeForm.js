import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {getTimes} from '../actions/get'
import {selectTime} from '../actions/selections';
import { connect } from 'react-redux'
import compose from 'recompose/compose';
import Select from 'react-select';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 350,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class TimeForm extends React.Component {

  handleChange = event => {
    this.props.selectTime(event.value)
  };

  filterTimes = () => {
    return this.props.availableTimes && this.props.availableTimes.filter(time=>time.resource_id===this.props.selections.employee.id)
  }

  render() {
   
    const { classes, selections, availableTimes, time } = this.props;
    if (!selections.location || !selections.service || !selections.employee || !selections.date) return null //customer form appears only after location, service and employee is selected
    if (availableTimes===null ) {this.props.getTimes(selections.service.id,selections.date)}
    else if (availableTimes[0].date!==selections.date) {
        this.props.getTimes(selections.service.id,selections.date)
      } 
    if (!availableTimes) return null
    const timeOptions = this.filterTimes().map(time=>({"value":time.time,"label":time.time}))
    // console.log(this.filterTimes().map(time=>time.resource_id).includes(this.props.selections.employee.id))
    return (
      <div className={classes.root}>
        <div className={classes.formControl}>
          <Fragment>
            <Select
              placeholder = "Pick a time..."
              isDisabled={false}
              isLoading={false}
              // backspaceRemoves={false}
              // deleteRemoves={false}
              // isClearable={true}
              isSearchable={true}
              name="time"
              options={timeOptions}
              onChange={this.handleChange}
              value={
                time && time !== ''  ? {value:time,label: time} : ''
              }
            />
          </Fragment>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return {
    selections: state.selections,
    availableTimes: state.availableTimes,
    availableDates: state.availableDates,
    time: state.selections.time
  }
}

TimeForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), connect(mapStateToProps,{getTimes, selectTime}))(TimeForm);