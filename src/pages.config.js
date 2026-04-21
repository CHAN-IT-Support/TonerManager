import Admin from './pages/Admin';
import AuthCallback from './pages/AuthCallback';
import Cabinets from './pages/Cabinets';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import TonerOverview from './pages/TonerOverview';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Admin": Admin,
    "AuthCallback": AuthCallback,
    "Cabinets": Cabinets,
    "Home": Home,
    "Login": Login,
    "Logout": Logout,
    "TonerOverview": TonerOverview,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
