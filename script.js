import React, { useState, useEffect } from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import { evaluate } from "https://esm.sh/mathjs";

const buttonsData = [
  { id: "divide", value: "/" },
  { id: "multiply", value: "*" },
  { id: "seven", value: "7" },
  { id: "eight", value: "8" },
  { id: "nine", value: "9" },
  { id: "subtract", value: "-" },
  { id: "four", value: "4" },
  { id: "five", value: "5" },
  { id: "six", value: "6" },
  { id: "add", value: "+" },
  { id: "one", value: "1" },
  { id: "two", value: "2" },
  { id: "three", value: "3" },
  { id: "equals", value: "=" },
  { id: "zero", value: "0" },
  { id: "decimal", value: "." }
];

function Screen({ text, disp }) {
  return (
    <div id="screen">
      <div style={{ fontSize: "0.75rem", float: "right" }}>{disp}</div>
      <div id="display" style={{ fontSize: "1.25rem" }}>
        {text}
      </div>
    </div>
  );
}

function Button(props) {
  function isOperator(value) {
    return isNaN(value) && value !== "." && value !== "=";
  }
  return (
    <div
      id={props.id}
      className={`button-container ${
        isOperator(props.children) ? "operator" : ""
      }`.trimEnd()}
      // event listener is calling another function
      onClick={() => props.handleClick(props.children)}
    >
      {props.children}
    </div>
  );
}

function Calculator() {
  const [input, setInput] = useState("0");
  const [screen, setScreen] = useState("0");

  function clearScreen() {
    setInput("0");
    setScreen("0");
  }

  function addInput(value) {
    const regE = /[+\-*\/]/gm;
    const regEx = /[-]/gm;
    const regExp = /[+*\/]/gm;
    switch (true) {
      case input === "0":
        value === "."
          ? (setInput(input + value), setScreen(input + value))
          : (setInput(value), setScreen(value));
        break;
      case screen.includes("="):
        setScreen(input + value), setInput(value);
        break;
      case regEx.test(value):
        regEx.test(screen)
          ? (setInput(value), setScreen(screen))
          : (setInput(value), setScreen(screen + value));
        break;
      case regExp.test(value):
        const firstIndex = screen.search(regE) || screen.length - 1;
        regE.test(screen) && /[+\-*\/]$/gm.test(screen)
          ? (setInput(value), setScreen(screen.slice(0, firstIndex) + value))
          : (setInput(value), setScreen(screen + value));
        break;
      case input.includes("."):
        value === "."
          ? setScreen(screen)
          : (setInput(input + value), setScreen(screen + value));
        break;

      default:
        setScreen(screen + value);
        setInput(input + value);
    }
  }

  function calculateResult() {
    const regResEx = /[+\-*\/]*$/gm;
    const newScreen = screen.replace(regResEx, "");

    const res = evaluate(newScreen);
    if (screen !== "0") {
      setInput(res);
      setScreen(newScreen + "=" + res);
    } else if (input === "0" && screen === "0") {
      alert("Please input a value.");
    }
  }

  return (
    <div className="wrapper">
      <div id="calculator-container">
        <Screen text={input} disp={screen} />
        <div id="button-pad">
          <div id="clear" className="button-container" onClick={clearScreen}>
            AC
          </div>
          {buttonsData.map((x) => {
            return (
              <Button
                id={x.id}
                handleClick={x.value !== "=" ? addInput : calculateResult}
              >
                {x.value}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function App() {
  return <Calculator />;
}

ReactDOM.render(<App />, document.getElementById("root"));