import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RoleProtected = ({ allowedRole, data}) => {
	const token = data.token;

	if (!token) return <Navigate to="/login" replace />;

	try {
		const decoded = jwtDecode(token);
		console.log(decoded.role, allowedRole)
		if (decoded.role === allowedRole) {
			return <Outlet />;
		} else if (decoded.role == "patient") {
			return <Navigate to="/" replace />;
		} else {
			return <Navigate to="/admin" replace />;
		}
	} catch (err) {
		return <Navigate to="/login" replace />;
	}
}

export default RoleProtected;