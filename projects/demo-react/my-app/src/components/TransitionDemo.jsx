import React from 'react';

function TransitionDemo() {
  // 输入框的状态
  const [value, setValue] = React.useState('');
  // 查询值的状态
  const [query, setQuery] = React.useState('');
  
  const handleChange = (e) => {
    // 改变输入框状态 高优任务
    setValue(e.target.value);
    // 改变查询状态 低优任务
    React.startTransition(() => {});
  }

  return (
    <div>
      <input type="text" value={value} placeholder="🔍输入搜索内容..."/>
    </div>
  )
}

export default TransitionDemo;
