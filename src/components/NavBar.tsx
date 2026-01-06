import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogin = () => {
    if (!isLoginPage) navigate("/login");
  };

  const AUTH_ACTIONS = [
    {
      icon: "inventory_line",
      handler: () => navigate("/dashboard"),
      tooltip: "Ir a Dashboard",
    },
    {
      icon: "exit_line",
      handler: handleLogout,
      tooltip: "Cerrar sesión",
    },
  ];

  return (
    <div className="w-full h-16 px-6 py-2 flex flex-row justify-between">
      <div className="flex items-center gap-x-1">
        <img
          className="inline-block w-8"
          src="/icons/rovote_icon.png"
          alt="Rovote Icon"
        />
        <h1 className="inline-block font-semibold text-2xl text-slate-500">
          Rovote
        </h1>
      </div>
      <div>
        {isAuthenticated ? (
          <div>
            {AUTH_ACTIONS?.map((action) => (
              <button
                key={action.icon}
                className={`mgc_${action.icon} border-none text-3xl mx-1 icon-button`}
                onClick={action.handler}
                title={action.tooltip}
              ></button>
            ))}
          </div>
        ) : (
          <button
            className="mgc_entrance_line border-none text-3xl"
            onClick={handleLogin}
            title="Ingresar"
          ></button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
