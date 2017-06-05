### CSS Modules 是什么

原生 css 写起来是让人泄气的, 因为 css 的编程能力太弱了。没有灵活的编程能力，css 的模块化就是面临很多问题。所以有的人使用 JavaScript 来写样式，这样就是使得样式的编写和其它 JavaScript 代码一样，具备灵活性和容易模块化。但是这种方式对于伪类却显得很乏力。

在出现 React 之前，人们某种程度上已经满足于 Sass/Less 预处理器带来的便捷。但是当 React 出现之后, JavaScript, HTML, CSS 又奇迹般的睡在了一起，JSX 给开发者带来了一致的代码写作体验，但是使用 JavaScript 的 Object 来定义样式，灵活和模块化都做到了，然后伪类还是很繁复，甚至需要监听鼠标时间来改变组件 state 中的伪类标记来引入不同的样式。而且在 JavaScript 代码中直接定义样式，对于工程师来说当然是喜闻乐见，但是对于设计师/UI来说，可不是很好玩。

那么有没有一种方案，能够使用原生的 CSS 来写样式，又富有灵活性和优良的模块化呢？ 答案就是 [css-modules](https://github.com/css-modules/css-modules).   它具备三个杀手锏的特性: 模块化, 无污染以及清晰显式的组合.  三个示例你就是基本上了解了其灵活的用法。

* 局部样式

```
.className {
  color: green;
}

// 或者

:local(.className) {
  color: green;
}
```

* 全局样式

```
:global(.className) {
  color: green;
}
```

* 组合 (compose)

```
.baseReadOnlyInputStyle {
  outline: none;
  box-shadow: inset 0px 0px 0px 0px red;
  word-break: break-word;
  display: inline;
  width: 80%;
  min-width: 48px ;
  cursor: text;
}

.onHoverInputStyle:hover {
  text-decoration-style: dashed;
}

.inputDisabled {
  composes: baseReadOnlyInputStyle onHoverInputStyle;
}
```

上面的三点基本上就解决了传统的 CSS 的大多数问题。 使用原生 CSS 写样式，通过 JavaScript 来管理样式的注入，这就是 [css-modules](https://github.com/css-modules/css-modules) 深得人心的原因。配合 React 使用的体验是超级爽, 只要在你的 webpack 配置文件中添加下面几行即可:

```
{
  test: /\.css$/,
  loader: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
}
```

### 炫酷的特性

* 类

styles.css
```
.title {
  font-weight: bold;
  font-size: 16px;
}

.email {
  padding: .5rem;
}

.submitButton {
  padding: .5rem;
  margin-top: .5rem;
  border: 1px solid #2F79AD;
  border-radius: 4px;
  background-color: #6DB9EE;
}

.submitButton:hover {
  background-color: #2F79AD;
}
```

app.jsx
```
import React from 'react';
import styles from './styles.css';

class Signup extends React.Component {
  render() {
    return (
      <div>
        <h2 className={styles.title}>
          Email gc
        </h2>
        <input className={styles.email} placeholder="Email Please"/>
        <br/>
        <button className={styles.submitButton}>
          Submit
        </button>
      </div>
    );
  }
}
export default Signup;
```

2. 包含类

styles.css
```
.button {
  padding: .5rem;
  margin-top: .5rem;
  border: 1px solid #2F79AD;
  border-radius: 4px;
  background-color: #6DB9EE;
}

.fun .button {
  font-weight: bold;
  background: linear-gradient(
    90deg,
    #ff0000, #ffff00,
    #00ff00, #00ffff,
    #ff00ff, #ff0000
  );
}
```

app.jsx
```
import React from 'react';
import styles from './styles.css';

class ButtonGroup extends React.Component {
  render() {
    return (
      <div>
        <button className={styles.button}>
        Regular Button
        </button>
        <br/>
        <div className={styles.fun}>
          <button className={styles.button}>
            FUN BUTTON
          </button>
        </div>
      </div>
    );
  }
}
export default ButtonGroup;
```

3. 组合

utils.css
```
/* grapes are round and purple */
.grape {
  border: 2px solid #ff00ff;
  border-radius: 10px;
  background-color: purple;
  color: white;
}

.grape:hover {
  background-color: #ff00ff;
}
```

styles.css
```
.button {
  composes: grape from './utils.css';
  padding: .5rem;
  margin-top: .5rem;
}
```

app.jsx
```
import React from 'react';
import styles from './styles.css';

class NiceButton extends React.Component {
  render() {
    return (
      <button className={styles.button}>
        Button
      </button>
    );
  }
}
export default NiceButton;
```

4. 标签

style.css
```
input.large {
  font-size: 20px;
}

.medium input {
  font-size: 14px;
}

.tiny * {
  font-size: 9px;
}
```

app.jsx
```
import React from 'react';
import styles from './styles.css';

class InputGroup extends React.Component {
  render() {
    return (
      <div>
        <input className={styles.large} placeholder="I am large" />
        <div className={styles.medium}>
          <input placeholder="I am medium" />
        </div>
        <div className={styles.tiny}>
          <input placeholder="I am so tiny" />
        </div>
      </div>
    );
  }
}
export default InputGroup;
```

5. media query

styles.css
```
.small {
  opacity: 0.2;
}
.large {
  opacity: 1.0;
}

@media (max-width: 600px) {
  .small {
    opacity: 1.0;
  }
  .large {
    opacity: 0.2;
  }
}
```

app.jsx
```
import React from 'react';
import styles from './styles.css';

class WindowGroup extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.small}>
          The Window is Small
        </div>
        <div className={styles.large}>
          The Window is Big
        </div>
      </div>
    );
  }
}
export default WindowGroup;
```

### 拓展阅读
* [React: CSS in your JS by Christopher Chedeau](http://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html)
* [css-modules docs](https://github.com/css-modules/css-modules/tree/master/docs)
* [CSS Modules 详解及 React 中实践](https://github.com/camsong/blog/issues/5)
