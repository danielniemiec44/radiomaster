import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from "./AppBar";

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.user?.user);

    useEffect(() => {
        if (user) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
            if(location.pathname === '/') {
                navigate('/main', { replace: true });
            } else {
                navigate(location.pathname, { replace: true });
            }
        } else {
            navigate('/', { replace: true });
        }
        setLoading(false);
    }, [dispatch, navigate, location.pathname]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return <>{user && <AppBar/>}{children}</>;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
