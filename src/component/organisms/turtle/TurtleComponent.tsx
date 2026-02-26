"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n";
import { showToast } from "@/lib/toast.config";
import "./turtle.css";

const TurtleComponent = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const commandCategories = {
    movement: {
      title: t("turtle.movementCommands"),
      icon: "🚀",
      color: "turtle-category-button-blue",
      commands: [
        ["forward", "distance"],
        ["backward", "distance"],
        ["right", "angle"],
        ["left", "angle"],
        ["goto", ["x", "y"]],
        ["home", ""],
        ["setx", "x"],
        ["sety", "y"],
      ],
    },
    drawing: {
      title: t("turtle.drawingTools"),
      icon: "✏️",
      color: "turtle-category-button-green",
      commands: [
        ["penup", ""],
        ["pendown", ""],
        ["width", "size"],
        ["colour", ["r", "g", "b", "a"]],
        ["fill", ["r", "g", "b", "a"]],
        ["circle", "radius"],
        ["dot", "size"],
      ],
    },
    utility: {
      title: t("turtle.helpfulTools"),
      icon: "⭐",
      color: "turtle-category-button-purple",
      commands: [
        ["reset", ""],
        ["clear", ""],
        ["showTurtle", ""],
        ["hideTurtle", ""],
        ["write", "text"],
      ],
    },
  };

  const singleCommands = {
    title: t("turtle.quickActions"),
    icon: "🎯",
    color: "turtle-quick-button-green",
    commands: [
      "reset",
      "clear",
      "showTurtle",
      "hideTurtle",
      "penup",
      "pendown",
      "home",
      "undo",
    ],
  };

  const exampleCode = `// 🎨 Fun Turtle Graphics Examples!
// Write your code here and run it!

// Draw a square
function square(size) {
  for (let i = 0; i < 4; i++) {
    forward(size);
    right(90);
  }
}

// Draw a star ⭐
function star() {
  for (let i = 0; i < 5; i++) {
    forward(100);
    right(144);
  }
}

// Create a spiral 🌀
function spiral() {
  for (let i = 0; i < 100; i++) {
    forward(i * 2);
    right(91);
  }
}

// Rainbow squares 🌈
function colorfulSquares() {
  hideTurtle();
  for (let s = 100; s > 0; s -= 10) {
    colour(s/100, 0.5, 1 - s/100, 1);
    square(s);
    right(36);
  }
}

// Flower pattern 🌸
function flower() {
  hideTurtle();
  for (let i = 0; i < 36; i++) {
    colour(i/36, 0.7, 1, 1);
    forward(100);
    right(170);
  }
}

// ✨ Try typing: colorfulSquares() or flower()
// Have fun creating amazing drawings!`;

  useEffect(() => {
    // Wait a bit for the DOM to be ready
    const initializeTurtle = () => {
      // Dynamically load turtle.js
      const script = document.createElement("script");
      script.src = "/turtle.js";
      script.async = false; // Make it synchronous to ensure proper initialization
      script.onload = () => {
        if (
          typeof (window as unknown as Record<string, unknown>).reset ===
          "function"
        ) {
          setTimeout(() => {
            (window as unknown as Record<string, () => void>).reset();
          }, 100);
        }
      };
      script.onerror = () => {
        console.error("Failed to load turtle.js");
      };
      document.body.appendChild(script);

      return script;
    };

    // Wait for the component to be mounted
    const timer = setTimeout(() => {
      const script = initializeTurtle();

      // Cleanup function
      return () => {
        if (script && document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const runCommand = (cmd: string) => {
    try {
      const definitions =
        (document.getElementById("definitions") as HTMLTextAreaElement)
          ?.value || "";

      eval(definitions + "\n" + cmd);
    } catch (e) {
      console.error("Error executing command:", e);
      showToast.error("Error: " + (e as Error).message);
    }
  };

  return (
    <div className="turtle-container">
      {/* Header */}
      <div className="turtle-header">
        <div className="turtle-header-content">
          <div className="turtle-header-inner">
            <div className="turtle-header-left">
              <button
                onClick={() => router.push("/")}
                className="turtle-back-button"
              >
                <span>←</span>
                <span>{t("turtle.backToHome")}</span>
              </button>
              <div className="turtle-title-section">
                <span style={{ fontSize: "1.5rem" }}>🐢</span>
                <h1 className="turtle-title">
                  {t("turtle.turtleGraphicsEditor")}
                </h1>
              </div>
            </div>
            <div className="turtle-header-right">
              <div className="turtle-status">
                <span className="turtle-status-indicator"></span>
                <span>{t("turtle.canvasReady")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="turtle-main">
        <div className="turtle-grid">
          {/* Canvas and Controls */}
          <div className="turtle-col-span-2 turtle-space-y">
            {/* Canvas */}
            <div className="turtle-card">
              <div className="turtle-card-header">
                <h2 className="turtle-card-title">
                  <span style={{ fontSize: "1.5rem" }}>🎨</span>
                  <span>{t("turtle.drawingCanvas")}</span>
                </h2>
                <div className="turtle-card-subtitle">{t("turtle.pixels")}</div>
              </div>

              <div className="turtle-canvas-wrapper">
                <div className="turtle-canvas-container">
                  <canvas
                    id="turtlecanvas"
                    width="300"
                    height="300"
                    className="turtle-canvas"
                  />
                  <canvas
                    id="imagecanvas"
                    width="300"
                    height="300"
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>

            {/* Command Input */}
            <div className="turtle-card">
              <div className="turtle-card-header">
                <h2 className="turtle-card-title">
                  <span style={{ fontSize: "1.5rem" }}>💬</span>
                  <span>{t("turtle.commandConsole")}</span>
                </h2>
              </div>

              <div className="turtle-input-container">
                <div className="turtle-input-wrapper">
                  <input
                    id="command"
                    type="text"
                    placeholder={t("turtle.tryPlaceholder")}
                    autoCapitalize="off"
                    autoComplete="off"
                    spellCheck="false"
                    className="turtle-input"
                  />
                  <div className="turtle-input-hint">
                    <span>↵ {t("turtle.pressEnter")}</span>
                  </div>
                </div>

                <div className="turtle-button-group">
                  <button
                    id="runButton"
                    className="turtle-button turtle-button-primary"
                    title={t("turtle.executeCommand")}
                  >
                    <span>▶️</span>
                    <span>{t("turtle.run")}</span>
                  </button>
                  <button
                    id="resetButton"
                    className="turtle-button turtle-button-secondary"
                    title={t("turtle.clearCanvasReset")}
                  >
                    <span>🔄</span>
                    <span>{t("turtle.reset")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Commands */}
            <div className="turtle-card">
              <div className="turtle-card-header">
                <h2 className="turtle-card-title">
                  <span style={{ fontSize: "1.5rem" }}>
                    {singleCommands.icon}
                  </span>
                  <span>{singleCommands.title}</span>
                </h2>
              </div>

              <div className="turtle-quick-commands">
                {singleCommands.commands.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => runCommand(`${cmd}()`)}
                    className={`turtle-quick-button ${singleCommands.color}`}
                  >
                    {cmd}()
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="turtle-space-y">
            {/* Command Categories */}
            <div className="turtle-card">
              <div className="turtle-card-header">
                <h2 className="turtle-card-title">
                  <span style={{ fontSize: "1.5rem" }}>📚</span>
                  <span>{t("turtle.commandLibrary")}</span>
                </h2>
              </div>

              <div className="turtle-library">
                {Object.entries(commandCategories).map(([key, category]) => (
                  <div key={key} className="turtle-category">
                    <h3 className="turtle-category-title">
                      <span>{category.icon}</span>
                      <span>{category.title}</span>
                    </h3>
                    <div className="turtle-category-commands">
                      {category.commands.map(([cmd, args]) => (
                        <button
                          key={String(cmd)}
                          onClick={() => {
                            const argArray = Array.isArray(args)
                              ? args
                              : [args];
                            const values = argArray
                              .map(
                                (a) =>
                                  prompt(
                                    `${cmd}(${argArray.join(", ")}): enter ${a}`,
                                  ) ?? "",
                              )
                              .join(", ");
                            runCommand(`${cmd}(${values})`);
                          }}
                          className={`turtle-category-button ${category.color}`}
                        >
                          {cmd}({Array.isArray(args) ? args.join(", ") : args})
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Reference */}
            <div className="turtle-card">
              <div className="turtle-card-header">
                <h2 className="turtle-card-title">
                  <span style={{ fontSize: "1.5rem" }}>📖</span>
                  <span>{t("turtle.quickReference")}</span>
                </h2>
              </div>

              <div className="turtle-reference">
                <div className="turtle-reference-item turtle-reference-blue">
                  <h4>{t("turtle.basicMovement")}</h4>
                  <code>forward(100), right(90), left(45)</code>
                </div>

                <div className="turtle-reference-item turtle-reference-green">
                  <h4>{t("turtle.drawing")}</h4>
                  <code>colour(1,0,0,1), width(5), penup(), pendown()</code>
                </div>

                <div className="turtle-reference-item turtle-reference-purple">
                  <h4>{t("turtle.loops")}</h4>
                  <code>{`repeat(4, function() { forward(100); right(90); })`}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Definitions */}
        <div className="turtle-card" style={{ marginTop: "1.5rem" }}>
          <div className="turtle-card-header">
            <h2 className="turtle-card-title">
              <span style={{ fontSize: "1.5rem" }}>💻</span>
              <span>{t("turtle.functionDefinitions")}</span>
            </h2>
            <div className="turtle-card-subtitle">
              {t("turtle.defineFunctionsHint")}
            </div>
          </div>

          <textarea
            id="definitions"
            rows={20}
            defaultValue={exampleCode}
            className="turtle-textarea"
            placeholder={t("turtle.functionPlaceholder")}
          />
        </div>

        {/* Features Info */}
        <div className="turtle-features">
          <div className="turtle-feature-card">
            <div className="turtle-feature-header">
              <span style={{ fontSize: "1.25rem" }}>🎯</span>
              <h3 className="turtle-feature-title">
                {t("turtle.interactiveCanvas")}
              </h3>
            </div>
            <p className="turtle-feature-description">
              {t("turtle.interactiveCanvasDesc")}
            </p>
          </div>

          <div className="turtle-feature-card">
            <div className="turtle-feature-header">
              <span style={{ fontSize: "1.25rem" }}>🔄</span>
              <h3 className="turtle-feature-title">
                {t("turtle.liveProgramming")}
              </h3>
            </div>
            <p className="turtle-feature-description">
              {t("turtle.liveProgrammingDesc")}
            </p>
          </div>

          <div className="turtle-feature-card">
            <div className="turtle-feature-header">
              <span style={{ fontSize: "1.25rem" }}>🎨</span>
              <h3 className="turtle-feature-title">
                {t("turtle.creativeDrawing")}
              </h3>
            </div>
            <p className="turtle-feature-description">
              {t("turtle.creativeDrawingDesc")}
            </p>
          </div>

          <div className="turtle-feature-card">
            <div className="turtle-feature-header">
              <span style={{ fontSize: "1.25rem" }}>📚</span>
              <h3 className="turtle-feature-title">
                {t("turtle.educationalFocus")}
              </h3>
            </div>
            <p className="turtle-feature-description">
              {t("turtle.educationalFocusDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurtleComponent;
