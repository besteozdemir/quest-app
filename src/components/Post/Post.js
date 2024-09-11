import React, { useRef, useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import Comment from "../Comment/Comment";
import CommentForm from "../Comment/CommentForm";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',
}));

const StyledLink = styled(Link)({
    textDecoration: 'none',
    color: 'inherit',
});

function Post(props) {
    const { title, text, userId, userName, postId, likes } = props;
    const [expanded, setExpanded] = useState(false);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const isInitialMount = useRef(true);
    const [likeCount, setLikeCount] = useState(likes.length);
    const [likeId, setLikeId] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const isUserLoggedIn = localStorage.getItem("currentUser") !== null;

    const handleExpandClick = () => {
        setExpanded(!expanded);
        refreshComments();
        console.log(commentList);
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        if (!isLiked) {
            saveLike();
            setLikeCount(likeCount + 1);
        } else {
            deleteLike();
            setLikeCount(likeCount - 1);
        }
    };

    const refreshComments = () => {
        fetch("http://localhost:8080/comments?postId=" + postId)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setCommentList(result);
                },
                (error) => {
                    console.log(error);
                    setIsLoaded(true);
                    setError(error);
                }
            );
        setRefresh(false);
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            refreshComments();
        }
    }, [refresh]);

    const saveLike = () => {
        fetch('http://localhost:8080/likes', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : localStorage.getItem("tokenKey"),
            },
            body: JSON.stringify({
                postId: postId,
                userId: localStorage.getItem("currentUser"),
            }),
        })
            .then((res) => res.json())
            .catch((err) => console.log(err));
    };

    const deleteLike = () => {
        fetch('http://localhost:8080/likes/' + likeId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : localStorage.getItem("tokenKey"),
            },
        })
            .catch((err) => console.log(err));
    };

    const checkLikes = () => {
        var likeControl = likes.find((like => "" + like.userId === localStorage.getItem("currentUser")));
        if (likeControl != null) {
            setLikeId(likeControl.id);
            setIsLiked(true);
        }
    };

    const addComment = (newComment) => {
        setCommentList((prevComments) => [...prevComments, newComment]);
    };

    useEffect(() => { checkLikes() }, []);

    return (
        <div className="postContainer">
            <Card sx={{ width: 800 }}>
                <CardHeader
                    avatar={
                        <StyledLink to={{ pathname: '/users/' + userId }}>
                            <Avatar sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }} aria-label="recipe">
                                {userName ? userName.charAt(0).toUpperCase() : "?"}
                            </Avatar>
                        </StyledLink>
                    }
                    title={
                        <Typography variant="h6" component="div" sx={{ textAlign: 'left' }}>
                            {title}
                        </Typography>
                    }
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                        {text}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton
                        disabled={!isUserLoggedIn}
                        onClick={handleLike}
                        aria-label="add to favorites"
                    >
                        <FavoriteIcon style={isLiked ? { color: "red" } : null} />
                    </IconButton>
                    {likeCount}
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <CommentIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Container fixed>
                        {error ? "Error loading comments" :
                            isLoaded ? commentList.map(comment => (
                                <Comment key={comment.id} userId={comment.userId} userName={comment.userName} text={comment.text} />
                            )) : "Loading"}
                        {isUserLoggedIn ?
                            <CommentForm userId={localStorage.getItem("currentUser")} userName={localStorage.getItem("userName")} postId={postId} addComment={addComment} /> : ""}
                    </Container>
                </Collapse>
            </Card>
        </div>
    );
}

export default Post;
