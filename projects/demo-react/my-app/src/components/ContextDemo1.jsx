// 动态 Context

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

const ThemeContext = React.createContext(themes.dark);   // 默认暗色主题
ThemeContext.displayName = "Theme";

class ThemedButton extends React.Component {
  render() {
    const props = this.props;
    const theme = this.context;  // themes.dark
    return (
      <button {...props} style={{ backgroundColor: theme.background, color: theme.foreground }}>主题按钮</button>
    );
  }
}
ThemedButton.contextType = ThemeContext;  // 现在 this.context 能获取到 themes.dark 了


function MiddleComponent(props) {
  return (
    <ThemedButton onClick={props.changeTheme}>
      Change Theme
    </ThemedButton>
  );
}

class ContextDemo1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { theme: themes.light };
    this.toggleTheme = () => {
      this.setState(state => ({ theme: state.theme === themes.dark ? themes.light : themes.dark }));
    };
  }

  render() {
    // 在 ThemeProvider:
    // 1. 内部的 ThemedButton 按钮组件使用 Provider 的值，也就是 state 中的 theme 值
    // 2. 外部的组件使用 React.createContext(themes.dark) 默认的 theme 值
    return (
      <div>
        <ThemeContext.Provider value={this.state.theme}>
          {/* 随着按钮点击而改变主题 */}
          <MiddleComponent changeTheme={this.toggleTheme} />
        </ThemeContext.Provider>
        <section>
          {/* 一直不变，维持暗色主题 */}
          <ThemedButton />
        </section>
      </div>
    );
  }
}

export default ContextDemo1;