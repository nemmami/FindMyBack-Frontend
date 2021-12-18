/*
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Custom styles
import './stylesheets/main.css';

// This is the entry point to your app : add all relevant import and custom code
*/

import "bootstrap/dist/css/bootstrap.min.css";
import "./stylesheets/main.css";
import NavBar from "./Components/NavBar/Navbar";
import Footer from "./Components/Footer/Footer";
import { Router } from "./Components/Router/Router";

NavBar();

Footer();

Router();
