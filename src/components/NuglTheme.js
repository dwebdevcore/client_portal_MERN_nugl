// theme docs: https://material-ui-next.com/customization/theme-default/
// http://www.0to255.com for light and dark (+/- 3)
// http://hex2rgba.devoth.com/ hex to rgba
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00A1E4",
      light: "#2EB2E8",
      dark: "#0084BB"
    },
    secondary: {
      main: "#EB008B",
      light: "#EE2EA0",
      dark: "#C10072"
    },
    tertiary: {
      main: "#04E762",
      light: "#31EB7E",
      dark: "#04BE51"
    }
  },
  overrides: {
    MuiAppBar: {
      root: {
        boxShadow: "none",
        backgroundColor: "#ffffff"
      },
      colorPrimary: {
        color: "#fff",
        height: "100%",
        width: "100%",
        background:
          "linear-gradient(230deg,#04e762,#00a1e4,#eb008b) center center/300% 300% no-repeat !important",
        animation: "GradientAnimator 29s ease infinite"
      }
    },
    MuiButton: {
      raised: {
        borderRadius: 0
      },
      raisedPrimary: {
        color: "#fff"
      },
      raisedSecondary: {
        color: "#fff"
      }
    }
  }
});

export default theme;
