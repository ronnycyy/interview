// 在嵌套组件中更新 Context
// 从一个在组件树中嵌套很深的组件中更新 context 是很有必要的。
// 在这种场景下，你可以通过 context 传递一个函数，使得 consumers 组件更新 context

import React from 'react';

const themes = {
  light: {
    foreground: '#000000',
    background: '#ffffff',
  },
  dark: {
    foreground: '#ffffff',
    background: '#000000',
  },
};

const ThemeContext = React.createContext({ theme: themes.dark, toggleTheme: () => { } });

function ThemeTogglerButton() {
  return (
    <ThemeContext.Consumer>
      {({ theme, toggleTheme }) => (
        // 接收到的是最近一层 Provider 提供的 value 对象，value.theme, value.toggleTheme。
        <button onClick={toggleTheme} style={{ backgroundColor: theme.background, color: theme.foreground }}>Toggle Theme</button>
      )}
    </ThemeContext.Consumer>
  );
}

function Content() {
  return (
    <div>
      <ThemeTogglerButton />
    </div>
  );
}

class ContextDemo2 extends React.Component {
  constructor(props) {
    super(props);
    this.toggleTheme = () => {
      this.setState(state => ({ theme: state.theme === themes.dark ? themes.light : themes.dark }));
    };
    // State 也包含了更新函数，因此它会被传递进 context provider。
    this.state = { theme: themes.light, toggleTheme: this.toggleTheme };
  }
  render() {
    // 整个 state 都被传递进 provider
    return (
      <ThemeContext.Provider value={this.state}>
        <Content />
      </ThemeContext.Provider>
    );
  }
}

export default ContextDemo2;
