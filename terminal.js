const COMMANDS = {
  about: {
    aliases: ["about"],
    output: () => "AI Engineer building production AI systems from research to deployment.",
  },
  whoami: {
    aliases: ["whoami"],
    output: () => "Vivek Tiwari",
  },
  role: {
    aliases: ["role"],
    output: () => "AI Engineer @ Nexus3",
  },
  focus: {
    aliases: ["focus"],
    output: () => "Production AI systems | LLM architectures | Applied AI research | Multi-agent systems",
  },
  work: {
    aliases: ["work"],
    output: () => "Nexus3 | Zof AI | Indiana University Bloomington | DocPlus",
  },
  stack: {
    aliases: ["stack", "stack --short"],
    output: () => "Python | PyTorch | Transformers | CrewAI | LLMOps | FastAPI | Airflow | Docker | AWS",
  },
  interests: {
    aliases: ["interests"],
    output: () => "AI agents | RAG | knowledge representation | efficient inference | transformer architectures",
  },
  projects: {
    aliases: ["projects", "projects --featured"],
    output: () => `
      <a href="https://github.com/vivek-tiwari-vt/agmem" target="_blank" rel="noreferrer">agmem</a><span> - version control for AI agent memories</span><br>
      <a href="https://github.com/vivek-tiwari-vt/attention-atlas" target="_blank" rel="noreferrer">attention-atlas</a><span> - transformer interpretability</span><br>
      <a href="https://github.com/vivek-tiwari-vt/DOCAI" target="_blank" rel="noreferrer">DOCAI</a><span> - document intelligence systems</span>`,
    className: "project-result",
  },
  writing: {
    aliases: ["writing"],
    output: () => "ML architectures, agent systems, and practical AI engineering.",
  },
  contact: {
    aliases: ["contact"],
    output: () => '<a href="https://www.linkedin.com/in/vivek-tiwari-vt/" target="_blank" rel="noreferrer">linkedin.com/in/vivek-tiwari-vt</a><span> | </span><a href="https://secretive-hemisphere-799.notion.site/PORTFOLIO-1d146a2a24148073bad5e159fe3a9106" target="_blank" rel="noreferrer">portfolio</a>',
  },
  pwd: {
    aliases: ["pwd"],
    output: () => "~/profile",
  },
  ls: {
    aliases: ["ls", "ls -la"],
    output: () => "about  contact  interests  projects  stack  work  writing",
  },
  launch: {
    aliases: ["launch"],
    output: () => "Interactive terminal active. Type a command below.",
  },
};

const input = document.querySelector("#shell-input");
const form = document.querySelector("#shell-form");
const scrollback = document.querySelector("#scrollback");
const output = document.querySelector("#output");
const announcement = document.querySelector("#announcement");
const commandCount = document.querySelector("#command-count");
const sessionTime = document.querySelector("#session-time");
const commandHistory = [];
let historyIndex = 0;
let commandsRun = 0;

const commandNames = Object.values(COMMANDS).flatMap(({ aliases }) => aliases);
const helpCommands = ["about", "whoami", "role", "focus", "work", "stack", "interests", "projects", "writing", "contact", "pwd", "ls", "history", "clear"];

function now() {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" }).format(new Date());
}

function normalize(rawCommand) {
  return rawCommand.trim().replace(/^\$\s*/, "").replace(/\s+/g, " ").toLowerCase();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

function resolveCommand(rawCommand) {
  const normalized = normalize(rawCommand);
  return Object.entries(COMMANDS).find(([, definition]) => definition.aliases.includes(normalized));
}

function suggestion(command) {
  const match = commandNames.find((name) => name.startsWith(command) || command.startsWith(name));
  return match ? ` Did you mean '${match}'?` : " Try 'help'.";
}

function helpMarkup() {
  return helpCommands.map((name) => `<button data-command="${name}">${name}</button>`).join("<span class=\"help-gap\"> </span>");
}

function historyMarkup() {
  if (!commandHistory.length) return "No commands entered in this session.";
  return commandHistory.map((command, index) => `<span class="history-number">${index + 1}</span> ${escapeHtml(command)}`).join("<br>");
}

function appendCommand(rawCommand, result, className = "") {
  const block = document.createElement("div");
  block.className = "command-block command-block-new";
  block.innerHTML = `<div class="command-line"><time>${now()}</time><span class="prompt">$</span><span class="typed-command">${escapeHtml(rawCommand)}</span></div><div class="command-result ${className}">${result}</div>`;
  scrollback.append(block);
  output.scrollTop = output.scrollHeight;
  block.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function clearTerminal() {
  scrollback.replaceChildren();
  commandsRun += 1;
  commandCount.textContent = commandsRun;
  announcement.textContent = "Terminal cleared.";
}

function runCommand(rawCommand) {
  const normalized = normalize(rawCommand);
  if (!normalized) return;

  if (normalized === "clear") {
    clearTerminal();
    return;
  }

  commandHistory.push(rawCommand.trim());
  historyIndex = commandHistory.length;
  commandsRun += 1;
  commandCount.textContent = commandsRun;

  if (normalized === "help") {
    appendCommand(rawCommand, helpMarkup());
    announcement.textContent = "Help commands displayed.";
    return;
  }

  if (normalized === "history") {
    appendCommand(rawCommand, historyMarkup());
    announcement.textContent = "Command history displayed.";
    return;
  }

  const resolved = resolveCommand(rawCommand);
  if (!resolved) {
    const command = normalized.split(" ")[0];
    appendCommand(rawCommand, `command not found: ${escapeHtml(command)}.${suggestion(command)}`);
    announcement.textContent = `Command not found: ${command}.`;
    return;
  }

  const [, definition] = resolved;
  appendCommand(rawCommand, definition.output(), definition.className || "");
  announcement.textContent = `${resolved[0]} output displayed.`;
}

function completeCommand() {
  const value = normalize(input.value);
  const matches = commandNames.filter((name) => name.startsWith(value));
  if (matches.length === 1) {
    input.value = matches[0];
  } else if (matches.length > 1) {
    appendCommand(value || "tab", matches.join("  "));
  }
}

document.addEventListener("click", (event) => {
  const commandButton = event.target.closest("[data-command]");
  if (!commandButton) return;
  runCommand(commandButton.dataset.command);
  input.focus();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(input.value);
  input.value = "";
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    completeCommand();
    return;
  }

  if (event.ctrlKey && event.key.toLowerCase() === "l") {
    event.preventDefault();
    clearTerminal();
    input.value = "";
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (historyIndex > 0) historyIndex -= 1;
    input.value = commandHistory[historyIndex] || "";
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (historyIndex < commandHistory.length) historyIndex += 1;
    input.value = commandHistory[historyIndex] || "";
  }
});

sessionTime.textContent = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date());
