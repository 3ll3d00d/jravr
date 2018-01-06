import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui-icons/Settings';
import FullScreenIcon from 'material-ui-icons/Fullscreen';
import ExitFullScreenIcon from 'material-ui-icons/FullscreenExit';
import ListItem from "material-ui/List/ListItem";
import ListItemIcon from "material-ui/List/ListItemIcon";
import ListItemText from "material-ui/List/ListItemText";
import ListItemAvatar from "material-ui/List/ListItemAvatar";
import Avatar from "material-ui/Avatar/Avatar";
import JRiverSelector from "../control/jriver/JRiverSelector";

const drawerWidth = 60;

const styles = rootHeight => theme => ({
    root: {
        width: '100%',
        height: rootHeight,
        marginTop: '0px',
        zIndex: 1,
        overflow: 'hidden',
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    appBar: {
        position: 'absolute',
        left: `${drawerWidth}px`,
        paddingRight: `${drawerWidth}px`,
        zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    drawerPaperClose: {
        position: 'relative',
        height: '100%',
        width: 60,
        overflowX: 'hidden',
    },
    drawerInner: {
        // Make the items inside not wrap when transitioning:
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        width: '100%',
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: 24,
        height: 'calc(100% - 56px)',
        marginTop: 56,
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 64px)',
            marginTop: 64,
        },
    },
    title: {
        flex: 1,
        paddingLeft: '12px'
    },
    avatar: {
        font: 'inherit',
        fontSize: '0.75em',
        borderRadius: '33%'
    },
    icon: {
        width: '48px',
        height: '48px',
    },
    listItem: {
        paddingLeft: '8px'
    }
});

class Menu extends Component {
    render() {
        const {commands, searchNodeId, selectedTitle, classes, handler, fullscreen, toggleFullScreen, children} = this.props;
        const drawer = (
            <Drawer type="permanent"
                    classes={{
                        paper: classNames(classes.drawerPaperClose),
                    }}
                    open={false}>
                <div className={classes.drawerInner}>
                    <div className={classes.drawerHeader}/>
                    <List className={classes.list}>
                        <ListItem button
                                  onClick={() => handler('Settings')}
                                  className={classes.listItem}>
                            <ListItemIcon>
                                <SettingsIcon className={classes.icon}/>
                            </ListItemIcon>
                            <ListItemText primary="Settings"/>
                        </ListItem>
                        {
                            commands.map(c =>
                                <ListItem button
                                          className={classes.listItem}
                                          key={c.id}
                                          onClick={() => handler(c.id)}>
                                    <ListItemAvatar>
                                        <Avatar alt={c.id} src={c.icon} className={classNames(classes.avatar, classes.icon)}/>
                                    </ListItemAvatar>
                                    <ListItemText primary={c.id}/>
                                </ListItem>
                            )
                        }
                    </List>
                </div>
            </Drawer>
        );
        const fsIcon = fullscreen ? <ExitFullScreenIcon/> : <FullScreenIcon/>;
        const fsRoot = fullscreen ? classes.root : Object.assign(classes.root, {height: window.innerHeight});
        return (
            <div className={fsRoot}>
                <div className={classes.appFrame}>
                    <AppBar className={classNames(classes.appBar)}>
                        <Toolbar disableGutters={true}>
                            <Typography type="title" color="inherit" noWrap className={classes.title}>
                                {selectedTitle}
                            </Typography>
                            {
                                searchNodeId
                                    ? <JRiverSelector categoryId={searchNodeId}/>
                                    : null
                            }

                            <IconButton aria-owns={'menu-appbar'}
                                        aria-haspopup="true"
                                        onClick={toggleFullScreen}
                                        color="contrast">
                                {fsIcon}
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    {drawer}
                    <main className={classes.content}>
                        {children}
                    </main>
                </div>
            </div>
        );
    }
}

Menu.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    handler: PropTypes.func.isRequired,
    selectedTitle: PropTypes.string.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    toggleFullScreen: PropTypes.func.isRequired,
    commands: PropTypes.array.isRequired,
    searchNodeId: PropTypes.number
};

// 100% works in fullscreen, window.innerHeight works otherwise
// can't access props though due to https://github.com/mui-org/material-ui/issues/7633
export const FullScreenMenu = withStyles(styles('100%'), {withTheme: true})(Menu);
export const NotFullScreenMenu = withStyles(styles(window.innerHeight), {withTheme: true})(Menu);