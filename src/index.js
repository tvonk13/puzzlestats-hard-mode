import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { HashRouter } from "react-router-dom";
import CssBaseLine from "@material-ui/core/CssBaseline";

import App from "./App";

const theme = createMuiTheme({ 
	palette: {
		primary: { 
			main: "#263238",
			light: "#4f5b62",
			dark: "#000a12",
		},
		secondary: { 
			main: "#B0BEC5",
			light: "#e2f1f8",
			dark: "#808e95",
		},
		best: "#ffc400",
		average: "#00b0ff",
		today: "#ec407a",
		error: {
			main: "#ff604f"
		},
		success: {
			main: "#4caf50",
		}
	},
	typography: {
		fontFamily: 'Roboto'
	},
	overrides: {
		MuiPickersDay: {
			current: {
				backgroundColor: "#e2f1f8",
			}
		}
	}
});

ReactDOM.render(
	<ThemeProvider theme={theme}>
	<CssBaseLine />
	<HashRouter>
	<App />
	</HashRouter>
	</ThemeProvider>,
	document.getElementById("root"),
);