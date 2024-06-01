import { useState } from 'react';
import './App.css';
import Editor from "@monaco-editor/react";
import Navbar from './Components/Navbar';
import spinner from './assets/spinner.svg'; // Make sure to provide the correct path to your spinner image

function App() {
    const [userCode, setUserCode] = useState(``);
    const [userLang, setUserLang] = useState("python");
    const [userTheme, setUserTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(20);
    const [userInput, setUserInput] = useState("");
    const [userOutput, setUserOutput] = useState("");
    const [loading, setLoading] = useState(false);

    const options = {
        fontSize: fontSize
    }

    async function compile() {
        setLoading(true);
        if (userCode === ``) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://54.152.12.229/api/v1/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: userCode,
                    input: userInput,
                    lang: userLang,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUserOutput(data.output);
        } catch (error) {
            console.error("Error compiling code:", error);
            setUserOutput("Error compiling code");
        } finally {
            setLoading(false);
        }
    }

    function clearOutput() {
        setUserOutput("");
    }

    return (
        <div className="App">
            <Navbar
                userLang={userLang} setUserLang={setUserLang}
                userTheme={userTheme} setUserTheme={setUserTheme}
                fontSize={fontSize} setFontSize={setFontSize}
            />
            <div className="main">
                <div className="left-container">
                    <Editor
                        options={options}
                        height="calc(100vh - 50px)"
                        width="100%"
                        theme={userTheme}
                        language={userLang}
                        defaultLanguage="python"
                        defaultValue="# Enter your code here"
                        onChange={(value) => { setUserCode(value) }}
                    />
                    <button className="run-btn" onClick={compile}>
                        Run
                    </button>
                </div>
                <div className="right-container">
                    <h4>Input:</h4>
                    <div className="input-box">
                        <textarea
                            id="code-inp"
                            onChange={(e) => setUserInput(e.target.value)}
                            value={userInput}
                        />
                    </div>
                    <h4>Output:</h4>
                    {loading ? (
                        <div className="spinner-box">
                            <img src={spinner} alt="Loading..." />
                        </div>
                    ) : (
                        <div className="output-box">
                            <pre>{userOutput}</pre>
                            <button onClick={clearOutput} className="clear-btn">
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
