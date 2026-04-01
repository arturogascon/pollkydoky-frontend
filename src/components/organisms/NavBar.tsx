import { useAuth } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../atoms/Button";

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
      icon: "black_board_2_line",
      handler: () => navigate("/dashboard"),
      tooltip: "Ir a Dashboard",
    },
    {
      icon: "arrow_to_right_line",
      handler: handleLogout,
      tooltip: "Cerrar sesión",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-16 px-6 py-2 flex flex-row items-center justify-between bg-background/80 backdrop-blur-md border-b border-border">
      <Link className="cursor-pointer hover:no-underline" to="/">
        <div className="flex items-center gap-x-1">
          <img
            className="inline-block w-14"
            src="/icons/pollkydoky.png"
            alt="Pollky Doky Icon"
          />
          <div className="inline-block font-semibold text-2xl ">
            <span className="text-foreground">Pollky</span>
            <span className="text-primary">Doky</span>
          </div>
        </div>
      </Link>

      <div>
        {isAuthenticated ? (
          <div>
            {AUTH_ACTIONS?.map((action) => (
              <button
                key={action.icon}
                className={`mgc_${action.icon} text-primary border-none text-3xl mx-1 icon-button cursor-pointer`}
                onClick={action.handler}
                title={action.tooltip}
              ></button>
            ))}
          </div>
        ) : (
          <Button icon="entrance_line" onClick={handleLogin}>
            Ingresar
          </Button>
        )}
      </div>
    </header>
  );
};

export default NavBar;
