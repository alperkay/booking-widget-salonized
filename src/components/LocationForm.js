import { connect } from 'react-redux'
import compose from 'recompose/compose';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {selectLocation} from '../actions/selections'
import { getLocations} from '../actions/get';
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

class LocationForm extends React.Component {

  componentWillMount() {
    this.props.getLocations()
  }

  handleChange = event => {
    this.props.selectLocation(this.props.locations.find(loc=>loc.name===event.value))
  };

  filterLocations = () => {
    if (!this.props.selections.service.id && !this.props.selections.employee.id) return this.props.locations
    if (this.props.selections.service.id && !this.props.selections.employee.id) return this.props.locations
    if (!this.props.selections.service.id && this.props.selections.employee.id) return this.props.locations
    return this.props.locations
  }

  render() {

    const { classes, locations, location } = this.props;
    if (!locations) return null
    const locationOptions = this.filterLocations().map(loc=>({"value":loc.name,"label":loc.name}))

    return (
      <div className={classes.root}>
        <div className={classes.formControl}>
          <Fragment>
            <Select
              placeholder = "Pick a location..."
              isDisabled={false}
              isLoading={false}
              isClearable={true}
              isSearchable={true}
              name="employee"
              options={locationOptions}
              onChange={this.handleChange}
              value={
                location !== '' ? {value:location.name,label: location.name} : ''
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
    locations: state.allLocations,
    selections: state.selections,
    location: state.selections.location
  }
}

LocationForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), connect(mapStateToProps, {selectLocation, getLocations}))(LocationForm);
