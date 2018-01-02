import React, {Component} from 'react';
import _ from "lodash";
import {withStyles} from 'material-ui/styles';
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";
import Chip from 'material-ui/Chip';
import {FontIcon, Slider} from 'react-md';
import {connect} from 'react-redux';
import {getActiveZone} from "../../store/jriver/reducer";
import {fetchZones, setVolume, muteVolume, unmuteVolume} from "../../store/jriver/actions";
import {getConfig} from "../../store/config/reducer";

const styles = theme => ({
    padded: {
        marginBottom: '8px'
    },
});

class Volume extends Component {

    componentDidMount = () => {
        this.props.fetchZones();
    };

    componentWillReceiveProps = (nextProps) => {
        if (this.props.config.valid === false && nextProps.config.valid === true) {
            console.warn("Fetching zones on validate");
            this.props.fetchZones();
        }
    };

    setVolume = zoneId => (value, event) => {
        this.props.setVolume(zoneId, value / 100);
    };

    slowSetVolume = zoneId => _.debounce(this.setVolume(zoneId), 50);

    muteVolume = zoneId => () => {
        this.props.muteVolume(zoneId);
    };

    unmuteVolume = zoneId => () => {
        this.props.unmuteVolume(zoneId);
    };

    makeMuteButton = (zoneId) => {
        const {zone} = this.props;
        if (!zone.muted) {
            return <FontIcon onClick={this.muteVolume(zoneId)}>volume_up</FontIcon>;
        } else {
            return <FontIcon onClick={this.unmuteVolume(zoneId)}>volume_off</FontIcon>;
        }
    };

    render() {
        const {zone, fetchZones, classes} = this.props;
        if (zone) {
            const currentVolume = zone.volumeRatio ? Math.round(zone.volumeRatio * 100) : 0;
            return (
                <Grid className={classes.padded} container justify={'space-around'} alignItems={'center'}>
                    <Grid item xs={2}>
                        <Chip label={zone.name}/>
                    </Grid>
                    <Grid item xs={9}>
                        <Slider id="volume-slider"
                                leftIcon={this.makeMuteButton(zone.id)}
                                discrete
                                discreteTicks={10}
                                onChange={this.slowSetVolume(zone.id)}
                                value={currentVolume}/>
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <Paper>
                    <Button raised onClick={fetchZones}>Load Zones</Button>
                </Paper>
            );
        }
    };
}

const mapStateToProps = (state) => {
    return {
        zone: getActiveZone(state),
        config: getConfig(state)
    };
};
export default connect(mapStateToProps, {
    setVolume,
    muteVolume,
    unmuteVolume,
    fetchZones
})(withStyles(styles, {withTheme: true})(Volume));