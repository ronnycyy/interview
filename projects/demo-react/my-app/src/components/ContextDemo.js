import React, { useContext, useState } from 'react';

const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  const [theme, setTheme] = useState(themes.dark);

  const onChangeTheme = () => {
    setTheme(theme === themes.dark ? themes.light : themes.dark);
  }

  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
      <button onClick={onChangeTheme}>change theme</button>
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}

export default App;