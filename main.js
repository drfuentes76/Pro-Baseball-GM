function handleCommand(cmd) {
  const output = document.getElementById("output");
  output.innerHTML += `<p>> You entered: ${cmd}</p>`;
}
window.handleCommand = handleCommand;
