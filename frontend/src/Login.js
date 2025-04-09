import React, { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { grey } from '@mui/material/colors';
import { useNavigate } from "react-router-dom";
// Removed unused imports:
// import CustomizedSnackbar from "./radiomaster/Utils/CustomizedSnackbar";
// import eventEmitter from "./radiomaster/Utils/eventEmitter";
import { useDispatch } from 'react-redux';
import { CustomFetch } from "./radiomaster/Utils/CustomFetch";

export default function Login() {
    const [login, setLogin] = React.useState("");
    const [password, setPassword] = React.useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChangeLogin = (event) => {
        setLogin(event.target.value);
    };

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const authMe = useCallback((event) => {
        event.preventDefault();
        CustomFetch(
            "login",
            "POST",
            {
                username: login,
                password: password
            },
            (data) => {
                dispatch({ type: 'LOGIN_SUCCESS', payload: data });
                navigate("/main", { replace: true });
                sessionStorage.setItem("user", JSON.stringify(data));
            },
            null,
            `Pomyślnie zalogowano jako: ${login}`
        );
    }, [login, password, navigate, dispatch]);

    return (
        <div>
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    width: "100%",
                    backgroundImage: "url(https://www.mintsoft.com/media/chzlxsn3/types_of_warehouse_blog.png?width=1200&height=630&v=1dab8149acd8d70)",
                    backgroundSize: "cover"
                }}
            >
                <Paper elevation={3} sx={{ padding: "20px", width: "300px", height: "auto" }}>
                    <Typography variant="h5" color={grey[500]} style={{ marginBottom: "20px" }}>
                        Warehouse - Admin
                    </Typography>
                    <form onSubmit={(event) => authMe(event)}>
                        <Stack direction="column" spacing={2}>
                            <TextField
                                label="Nazwa użytkownika"
                                value={login}
                                onChange={handleChangeLogin}
                                variant="filled"
                                fullWidth
                            />
                            <TextField
                                label="Hasło"
                                value={password}
                                onChange={handleChangePassword}
                                variant="filled"
                                type="password"
                                fullWidth
                            />
                            <Stack direction="column" spacing={1}>
                                <Button type="submit" variant="contained" color="primary" gutterBottom>
                                    Zaloguj się
                                </Button>
                                <Button variant="text" color="secondary" gutterBottom>
                                    Przejdź do sklepu
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Paper>
            </Box>
        </div>
    );
}
