import { exec, spawn } from "node:child_process";
import { watch } from "node:fs/promises";

// console.log(process.argv);
const [node, _, file] = process.argv;
// ---------------------------USE A COMMAND like 'ls'---------------------------

// exec("ls", (error, out, err) => {
//   console.log({
//     error,
//     out,
//     err,
//   });
// });

// -----------Other way for same thing----------------
// const pr = spawn("ls");
// pr.stdout.on("data", (data) => {
//   console.log(data.toString("utf8"));
// });

// pr.stderr.on("data", (data) => {
//   console.error(data.toString("utf8"));
// });

// pr.on("close", (code) => {
//   console.error(`process exited ${code}`);
// });

// -----------WatchFileForAutoRefresh----------------

function spawnNode() {
  const pr = spawn(node, [file]);
  pr.stdout.pipe(process.stdout);
  pr.stderr.pipe(process.stderr);
  // pr.stdout.on("data", (data) => {
  //   console.log(data.toString("utf8"));
  // });

  // pr.stderr.on("data", (data) => {
  //   console.error(data.toString("utf8"));
  // });

  pr.on("close", (code) => {
    // if (code > 0) {
    //   throw new Error(`process exited : ${code}`);
    // }

    if (code !== null) {
      process.exit(code);
    }
  });

  return pr;
}

let childNodeProcess = spawnNode();
const watcher = watch("./", { recursive: true });
for await (const event of watcher) {
  if (event.filename.endsWith(".js")) {
    childNodeProcess.kill("SIGKILL");
    childNodeProcess = spawnNode();
  }
  // console.log(event);
}
