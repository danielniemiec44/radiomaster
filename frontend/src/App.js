import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';
import {SnackbarProvider} from 'notistack';
import {useSelector} from 'react-redux';
import PrivateRoute from './radiomaster/PrivateRoute';
import Login from './Login';
import Main from './radiomaster/Main';
import CustomizedSnackbar from './radiomaster/Utils/CustomizedSnackbar';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {YouTube} from "@mui/icons-material";
import YouTubeRecorder from "./radiomaster/Components/YouTubeRecorder";
import Player from "./radiomaster/Components/Player";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        retryDelay: 1000,
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
    });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <SnackbarProvider maxSnack={3}>
          <ThemeProvider theme={lightTheme}>
          <Router>
            <Routes>
              <Route path="/" element={<PrivateRoute><Main /></PrivateRoute>} />
              <Route path="/login" element={<PrivateRoute><Login /></PrivateRoute>} />
              <Route path="/yt" element={<YouTubeRecorder />} />
              <Route path={"/player"} element={<Player />} />
            </Routes>
          </Router>
          </ThemeProvider>
          <CustomizedSnackbar />
        </SnackbarProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;