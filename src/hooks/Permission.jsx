import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const Permission = ({ role, children }) => {
  const userRole = useSelector((state) => state.auth.role); 
  return userRole === role ? children : null;
};
Permission.propTypes = {
  role: PropTypes.string.isRequired, 
  children: PropTypes.node.isRequired 
};
export default Permission;
