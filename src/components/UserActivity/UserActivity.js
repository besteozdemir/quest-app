import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Post from "../Post/Post";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PopUp({ isOpen, postId, setIsOpen }) {
  const [open, setOpen] = useState(isOpen);
  const [post, setPost] = useState();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getPost = () => {
    fetch(`http://localhost:8080/posts/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("tokenKey"),
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setPost(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (postId) {
      getPost();
    }
  }, [postId]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Post Details
          </Typography>
        </Toolbar>
      </AppBar>
      {post ? (
        <Post
          likes={post.postLikes}
          postId={post.id}
          userId={post.userId}
          userName={post.userName}
          title={post.title}
          text={post.text}
        />
      ) : (
        "Loading..."
      )}
    </Dialog>
  );
}

function UserActivity(props) {
  const { userId } = props;
  const currentUserId = localStorage.getItem("currentUser"); // Logged-in user's ID
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const navigate = useNavigate(); // To handle redirection

  // Fetch either notifications or posts depending on the profile being viewed
  const fetchData = () => {
    const url = currentUserId === userId 
      ? `http://localhost:8080/users/activity/${userId}` // Fetch notifications for own profile
      : `http://localhost:8080/posts?userId=${userId}`;   // Fetch posts for other profiles

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("tokenKey"),
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  useEffect(() => {
    if (!currentUserId && currentUserId !== userId) {
      return;
    }
    fetchData();
  }, [userId]);

  if (!currentUserId) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <Paper
          sx={{
            padding: 4,
            textAlign: 'center',
            maxWidth: '400px', // Optional: to limit the width of the Paper component
            width: '100%',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Please log in to view user's profile.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/auth')}
          >
            Login / Register
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6" component="div">
                  {currentUserId === userId ? "Your Notifications" : "Recent Posts"}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {currentUserId === userId ? (
                      <Button
                        onClick={() => {
                          setSelectedPostId(item[1]); // Assuming item[1] is the postId
                          setPopUpOpen(true);
                        }}
                      >
                        {item[3] + " " + item[0] + " your post"}
                      </Button>
                    ) : (
                      <Post
                        likes={item.postLikes}
                        postId={item.id}
                        userId={item.userId}
                        userName={item.userName}
                        title={item.title}
                        text={item.text}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center">
                  {currentUserId === userId
                    ? "No new notifications."
                    : "No posts found for this user."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PopUp
        isOpen={popUpOpen}
        postId={selectedPostId}
        setIsOpen={setPopUpOpen}
      />
    </Paper>
  );
}

export default UserActivity;
