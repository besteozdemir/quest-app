import React, { useState, useEffect } from "react";
import Post from "../Post/Post";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { CssBaseline } from "@mui/material";
import PostForm from "../Post/PostForm";

function Home() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);

    const refreshPosts = () => {
        fetch("http://localhost:8080/posts")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setPostList(result);
                },
                (error) => {
                    console.log(error);
                    setIsLoaded(true);
                    setError(error);
                }
            );
    };

    useEffect(() => {
        refreshPosts();
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <React.Fragment>
                <CssBaseline />
                <Container maxWidth="lg">
                    <Box sx={{ bgcolor: '#cfe8fc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                        <Box sx={{ width: '100%', maxWidth: '800px' }}>
                            {localStorage.getItem("currentUser") ? (
                                <PostForm 
                                    userId={localStorage.getItem("currentUser")} 
                                    userName={localStorage.getItem("userName")} 
                                    refreshPosts={refreshPosts} 
                                />
                            ) : null}
                            {postList.map(post => (
                                <Box key={post.id} sx={{ width: '100%', mb: 4 }}>
                                    <Post 
                                        likes={post.postLikes} 
                                        postId={post.id} 
                                        userId={post.userId} 
                                        userName={post.userName} 
                                        title={post.title} 
                                        text={post.text} 
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Container>
            </React.Fragment>
        );
    }
}

export default Home;
