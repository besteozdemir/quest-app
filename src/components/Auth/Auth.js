import { FormControl, InputLabel, Input, Button, FormHelperText, Snackbar, Alert } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);  // Snackbar kontrolü için state
    const navigate = useNavigate();

    const handleUsername = (value) => {
        setUsername(value);
    };

    const handlePassword = (value) => {
        setPassword(value);
    };

    const sendRequest = (path) => {
        fetch('http://localhost:8080/auth/' + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: username,
                password: password,
            }),
        })
        .then((res) => res.json())
        .then((result) => {
            localStorage.setItem("tokenKey", result.message);
            localStorage.setItem("currentUser", result.userId);
            localStorage.setItem("userName", username);

            // Kayıt başarılı ise Snackbar'ı tetikle
            if (path === "register") {
                setIsRegister(true);
            }
        })
        .catch((err) => console.log(err))
        .finally(() => {
            setUsername("");
            setPassword("");
        });
    };

    const handleRegister = () => {
        sendRequest("register");
        navigate("/auth");
    };

    const handleLogin = () => {
        sendRequest("login");
        navigate("/");
    };

    // Snackbar'ı kapatma fonksiyonu
    const handleClose = () => {
        setIsRegister(false);
    };

    return (
        <div>
            <FormControl>
                <InputLabel style={{ top: 5 }}>Username</InputLabel>
                <Input value={username} onChange={(i) => handleUsername(i.target.value)} />
                <InputLabel style={{ top: 90 }}>Password</InputLabel>
                <Input style={{ top: 40 }} type="password" value={password} onChange={(i) => handlePassword(i.target.value)} />
                <Button variant="contained"
                    style={{
                        marginTop: 60,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white'
                    }}
                    onClick={handleRegister}>Register</Button>
                <FormHelperText style={{ margin: 20 }}>Are you already registered?</FormHelperText>
                <Button variant="contained"
                    style={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white'
                    }}
                    onClick={handleLogin}>Login</Button>
            </FormControl>

            {/* Kayıt sonrası başarılı mesajı için Snackbar */}
            <Snackbar
                open={isRegister}
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
                    You are successfully registered!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Auth;
