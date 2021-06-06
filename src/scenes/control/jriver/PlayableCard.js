import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import EnterIcon from '@material-ui/icons/SubdirectoryArrowLeft';
import {PLAY_TYPE_BROWSE} from "../../../services/jriver/mcws/browseChildren";
import CardMedia from "@material-ui/core/CardMedia";
import React from "react";
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    row: {
        display: 'flex',
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: theme.palette.background.default,
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        flexGrow: 1
    },
    content: {
        flex: '1 0 auto',
        padding: 0
    },
    cardIcon: {
        height: 24,
        width: 24,
        padding: 0
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(0.5),
    },
    cover: {
        height: 96,
        width: 96,
    },
    unpadded: {
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1)
    }
}));

const getImgUrl = (mcwsURL, type, id, width, height, fallbackColour, authToken) => {
    const path = type === PLAY_TYPE_BROWSE ? 'Browse/Image' : 'File/GetImage';
    const fileParam = type === PLAY_TYPE_BROWSE ? 'ID' : 'File';
    const params = `Token=${authToken}&${fileParam}=${id}&Format=png&Width=${width}&Height=${height}&Pad=1&FallbackColor=${fallbackColour}`;
    return `${mcwsURL}/${path}?${params}`;
};

const Description = ({content}) => {
    if (content.mediaType === 'Audio') {
        return (
            <>
                <Typography variant="body1" color="textSecondary">
                    {content.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {content.artist}
                    {' \u2022 '}
                    {new Date(content.duration * 1000).toISOString().substr(11, 8)}
                </Typography>
            </>
        )
    } else if (content.mediaType === 'Video') {
        if (content.mediaSubType === 'Movie') {
            const year = content.year ? ` \u2022 ${content.year}` : '';
            return (
                <>
                    <Typography variant="body1" color="textSecondary">
                        {content.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {content.rez}
                        {year}
                        {' \u2022 '}
                        {new Date(content.duration * 1000).toISOString().substr(11, 8)}
                    </Typography>
                </>
            )
        } else if (content.mediaSubType === 'TV Show') {
            let sub = null;
            if (content.season) {
                sub = `S${content.season}`;
            }
            if (content.episode) {
                sub = `${sub}E${content.episode}`;
            }
            if (sub) {
                sub = `${sub} \u2022 `;
            }
            const rez = content.rez ? `${content.rez} \u2022 ` : '';
            return (
                <>
                    <Typography variant="body1" color="textSecondary">
                        {content.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {sub}
                        {rez}
                        {new Date(content.duration * 1000).toISOString().substr(11, 8)}
                    </Typography>
                </>
            )
        }
    }
    return <Typography variant="body2" color="textSecondary">
        {content.name}
    </Typography>;
};

const PlayableCard = ({mcwsUrl, content, width, height, onSelect, fallbackColour, onPlay, authToken}) => {
    const classes = useStyles();
    const {type, name, id} = content;
    return (
        <Card key={id} className={classes.row} elevation={3}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Description content={content}/>
                </CardContent>
                <div className={classes.controls}>
                    <IconButton aria-label="Play"
                                className={classes.unpadded}
                                onClick={() => onPlay(type, id)}>
                        <PlayArrowIcon className={classes.cardIcon}/>
                    </IconButton>
                    {
                        type === PLAY_TYPE_BROWSE
                            ?
                            <IconButton aria-label="Enter"
                                        className={classes.unpadded}
                                        onClick={() => onSelect(id)}>
                                <EnterIcon className={classes.cardIcon}/>
                            </IconButton>
                            : null
                    }
                </div>
            </div>
            <CardMedia className={classes.cover}
                       image={getImgUrl(mcwsUrl, type, id, width, height, fallbackColour, authToken)}
                       component='img'
                       title={name}/>
        </Card>
    );
};

export default PlayableCard;