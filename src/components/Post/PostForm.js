import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import { InputAdornment, OutlinedInput } from "@mui/material";
import Button from '@mui/joy/Button';
import Snackbar from '@mui/joy/Snackbar';
import Alert from '@mui/material/Alert';

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

function PostForm(props) {
    const { userId, userName, refreshPosts } = props;
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [isSend, setIsSend] = useState(false);

    const savePost = () => {
        fetch("http://localhost:8080/posts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : localStorage.getItem("tokenKey")
                },
                body: JSON.stringify({
                    title: title,
                    userId: userId,
                    text: text,
                }),
            })
            .then((res) => res.json())
            .then(() => {
                setIsSend(true);
                setTitle("");
                setText("");
                refreshPosts();
            })
            .catch((err) => console.log("Error creating post:", err))
    }

    const handleSubmit = () => {
        savePost();
    }

    const handleTitle = (value) => {
        setTitle(value);
        setIsSend(false);
    }

    const handleText = (value) => {
        setText(value);
        setIsSend(false);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsSend(false);
    };

    return (
        <div className="postContainer" style={{ marginBottom: '30px' }}>
            <Card sx={{ width: 800 }}>
                <CardHeader
                    avatar={
                        <StyledLink to={{ pathname: '/users/' + userId }}>
                            <Avatar sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }} aria-label="recipe">
                                {userName.charAt(0).toUpperCase()}
                            </Avatar>
                        </StyledLink>
                    }
                    title={
                        <Typography variant="h6" component="div" sx={{ textAlign: 'left' }}>
                            <OutlinedInput
                                id="outlined-adorment-amount"
                                multiline
                                placeholder="Title"
                                inputProps={{ maxLength: 25 }}
                                fullWidth
                                value={title}
                                onChange={(i) => handleTitle(i.target.value)}
                            />
                        </Typography>
                    }
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                        <OutlinedInput
                            id="outlined-adorment-amount"
                            multiline
                            placeholder="Text"
                            inputProps={{ maxLength: 250 }}
                            fullWidth
                            value={text}
                            onChange={(i) => handleText(i.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Button
                                        variant="contained"
                                        style={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: "white" }}
                                        onClick={handleSubmit}>
                                        Post
                                    </Button>
                                </InputAdornment>
                            }
                        />
                    </Typography>
                </CardContent>
            </Card>
            <Snackbar
                open={isSend}
                autoHideDuration={1500}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Your post is sent!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default PostForm;
