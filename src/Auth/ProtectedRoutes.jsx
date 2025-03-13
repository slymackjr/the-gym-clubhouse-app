import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const ProtectedRoutes = ({ role }) => {
  const { token, role: ability } = useSelector((state) => state.auth);
  const location = useLocation();
  const lastLocationRef = useRef(null); 

  useEffect(() => {
    if (token) {
      lastLocationRef.current = location.pathname;
    } else {
      lastLocationRef.current = null;
    }
  }, [location, token]);

  if (!token) {
    return <Navigate to="/" state={{ from: lastLocationRef.current }} replace />;
  }

  if (role && ability !== role) {
    return <Navigate to={lastLocationRef.current || "/"} replace />;
  }

  return <Outlet />;
};

ProtectedRoutes.propTypes = {
  role: PropTypes.string,
};

export default ProtectedRoutes;
