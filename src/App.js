import React, {Component} from 'react';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Config from "./scenes/config";
import Control from "./scenes/control";
import {FullScreenMenu, NotFullScreenMenu} from "./scenes/menu";
import Grid from '@material-ui/core/Grid';
import grey from '@material-ui/core/colors/grey';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';
import Fullscreen from "react-full-screen";
import {connect} from 'react-redux';
import {isAlive, stopAllPlaying, stopAllPollers} from "./store/jriver/actions";
import {getConfig} from "./store/config/reducer";
import {getErrors, getServerName, isJRiverDead} from "./store/jriver/reducer";
import {getOrderedCommands} from "./store/commands/reducer";
import {fetchCommands, sendCommand} from "./store/commands/actions";
import TivoChannelSelector from "./scenes/control/tivo/TivoChannelSelector";
import JRiverSelector from "./scenes/control/jriver/JRiverSelector";
import Errors from "./scenes/errors";
import {getPlayingNow} from "./store/playingnow/reducer";

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: grey,
        secondary: blueGrey,
        error: red
    }
});

export const SETTINGS = 'Settings';

class App extends Component {
    state = {
        hasSelected: false,
        selected: SETTINGS,
        fullscreen: false
    };

    componentDidMount = () => {
        if (this.props.config.valid) {
            this.props.isAlive();
        }
        this.props.fetchCommands();
    };

    componentWillReceiveProps = (nextProps) => {
        if (!nextProps.config.valid) {
            this.setState({selected: SETTINGS, hasSelected: false});
        } else if (nextProps.config.valid && !this.props.config.valid) {
            console.log("Initialising alive calls on config validation")
            this.props.isAlive();
        } 
        if (!this.state.hasSelected && nextProps.config.valid) {
            const {commands, playingNow} = nextProps;
            const playingNowCommand = (playingNow && playingNow !== "") ? commands.find(c => c.title === playingNow) : null;
            if (playingNowCommand) {
                this.setState({selected: playingNowCommand.id, hasSelected: false});
            }
        }
    };

    componentWillUnmount = () => {
        stopAllPollers();
    };

    handleMenuSelect = (selected) => {
        const {sendCommand} = this.props;
        if (typeof selected === 'string') {
            this.setState({selected: selected, hasSelected: true});
        } else {
            if (selected.hasOwnProperty('control') && selected.control === 'jriver') {
                // only send the command when we select something to play
            } else {
                sendCommand(selected);
            }
            this.setState({selected: selected.id, hasSelected: true});
        }
    };

    toggleFullScreen = () => {
        this.setState((prevState, prevProps) => {
            return {fullscreen: !prevState.fullscreen};
        });
    };

    getSelector = (selectedCommand) => {
        if (selectedCommand && selectedCommand.hasOwnProperty('control')) {
            if (selectedCommand.control === 'jriver') {
                return <JRiverSelector command={selectedCommand}/>;
            } else if (selectedCommand.control === 'tivo') {
                return <TivoChannelSelector/>;
            }
        }
        return null;
    };

    render() {
        const {commands, errors, jriverIsDead, playingNow} = this.props;
        const playingNowCommand = playingNow ? commands.find(c => c.title === playingNow) : null;
        const {selected, fullscreen} = this.state;
        const selectedCommand = selected !== SETTINGS ? commands.find(c => c.id === selected) : null;
        const selectorTitle = selected === SETTINGS ? SETTINGS : selectedCommand ? selectedCommand.title : null;
        const MenuComponent = fullscreen ? FullScreenMenu : NotFullScreenMenu;
        return (
            <Fullscreen enabled={fullscreen}>
                <MuiThemeProvider theme={theme}>
                    <MenuComponent handler={this.handleMenuSelect}
                                   selectorTitle={selectorTitle}
                                   selectedCommand={selectedCommand}
                                   selector={this.getSelector(selectedCommand)}
                                   commands={commands}
                                   fullscreen={fullscreen}
                                   toggleFullScreen={this.toggleFullScreen}>
                        <Grid container>
                            <Grid item xs={12}>
                                {selected === SETTINGS || !playingNowCommand
                                    ? <Config/>
                                    : <Control playingNowCommand={playingNowCommand} jriverIsDead={jriverIsDead}/>
                                }
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <Errors errors={errors}/>
                            </Grid>
                        </Grid>
                    </MenuComponent>
                </MuiThemeProvider>
            </Fullscreen>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        config: getConfig(state),
        serverName: getServerName(state),
        commands: getOrderedCommands(state),
        errors: getErrors(state),
        jriverIsDead: isJRiverDead(state),
        playingNow: getPlayingNow(state)
    };
};
export default connect(mapStateToProps, {isAlive, fetchCommands, sendCommand, stopAllPlaying})(App);
