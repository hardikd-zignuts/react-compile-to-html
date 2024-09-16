"use client";
import React, { useState, useEffect, useRef } from "react";
import { transform } from "@babel/standalone";

const HomePage = () => {
  const [code, setCode] = useState(`
  function MyApp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
      console.log("Email:", email);
      console.log("Password:", password);
    };

    return (
      <HashRouter>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Login
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email:
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-500 text-white py-2 rounded-lg transition-transform duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:bg-indigo-600 focus:outline-none"
            >
              Login
            </button>
          </div>

          {/* Sample navigation */}
          <nav className="text-center mt-6">
            <a href="#" className="text-indigo-600 hover:underline mr-4">Home</a>
            <a href="#/about" className="text-indigo-600 hover:underline">About</a>
          </nav>

          {/* Define routes */}
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/about">
              <About />
            </Route>
          </Switch>
        </div>
      </HashRouter>
    );
  }

  function Home() {
    return (
      <div>
        <h2 className="text-xl font-bold">Welcome to the Home Page</h2>
      </div>
    );
  }

  function About() {
    return (
      <div>
        <h2 className="text-xl font-bold">About Us</h2>
        <p className="text-gray-600">This is a demo of react-router-dom routing!</p>
      </div>
    );
  }
`);

  const [error, setError] = useState("");
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!code) return;
    generateComponent(code);
  }, [code]);

  const generateComponent = (input) => {
    try {
      const transformedCode = transform(input, {
        presets: ["react"],
        plugins: ["transform-react-jsx"],
      }).code;

      // Prepare the iframe content
      const iframeDoc = iframeRef.current.contentDocument;
      if (!iframeDoc) return;

      iframeDoc.open();
      iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@^2.2/dist/tailwind.min.css" rel="stylesheet">
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/react-router-dom@5/umd/react-router-dom.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script>
            const React = window.React;
            const ReactDOM = window.ReactDOM;
            const { HashRouter, Routes, Route, Link, Switch } = window.ReactRouterDOM;

            (function() {
              // Ensure React hooks like useState are properly referenced
              const { useState } = React;

              ${transformedCode}

              ReactDOM.createRoot(document.getElementById('root')).render(
                React.createElement(HashRouter, null, React.createElement(MyApp))
              );
            })();
          </script>
        </body>
      </html>
    `);
      iframeDoc.close();
      setError("");
    } catch (err) {
      console.error(err);
      setError(String(err));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Rendered Component</h2>
          <iframe
            ref={iframeRef}
            title="Component Preview"
            className="border p-4 rounded bg-gray-100 h-[90vh] w-full"
            style={{ border: "none" }}
          ></iframe>
        </div>
      </div>
      {error && (
        <p className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</p>
      )}
    </div>
  );
};

export default HomePage;
