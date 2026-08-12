const COMMANDS = {
  about: ["about", "AI Engineer building production AI systems from research to deployment."],
  work: ["work", "Nexus3 | Zof AI | Indiana University Bloomington | DocPlus"],
  stack: ["stack", "Python | PyTorch | Transformers | CrewAI | LLMOps | FastAPI | Airflow | Docker | AWS"],
  interests: ["interests", "AI agents | RAG | knowledge representation | efficient inference | transformer architectures"],
  projects: ["projects", "agmem | attention-atlas | DOCAI"],
  writing: ["writing", "ML architectures and systems design"],
  contact: ["contact", "LinkedIn: linkedin.com/in/vivek-tiwari-vt | Portfolio: secretive-hemisphere-799.notion.site"],
  whoami: ["whoami", "Vivek Tiwari"],
  role: ["role", "AI Engineer @ Nexus3"],
  focus: ["focus", "Production AI systems | LLM architectures | Applied AI research | Multi-agent systems"],
  launch: ["launch", "Interactive terminal ready below. Try a command."],
  help: ["help", "about  work  stack  interests  projects  writing  contact  launch  clear"],
};

const input = document.querySelector("#shell-input");
const output = document.querySelector("#output");
const interactive = document.querySelector("#interactive-terminal");
const typedCommand = document.querySelector("#typed-command");
const typedResult = document.querySelector("#typed-result");

function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase().replace(/^\$\s*/, "");
  if (!command) return;
  if (command === "clear") {
    interactive.hidden = true;
    typedCommand.textContent = "";
    typedResult.textContent = "";
    return;
  }

  const [label, result] = COMMANDS[command] || [command, `command not found: ${command}. Try 'help'.`];
  interactive.hidden = false;
  typedCommand.textContent = label;
  typedResult.textContent = result;
  interactive.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.querySelectorAll("[data-command]").forEach((element) => {
  element.addEventListener("click", () => runCommand(element.dataset.command));
});

document.querySelector("#launch-link").addEventListener("click", (event) => {
  event.preventDefault();
  runCommand("launch");
  input.focus();
});

document.querySelector("#shell-form").addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(input.value);
  input.value = "";
});

input.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  runCommand(input.value);
  input.value = "";
});

window.addEventListener("load", () => input.focus());
