import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { encodeFile } from "./encode-file";
import { runImage } from "./run-image";

yargs(hideBin(process.argv))
  .command(
    "encode [path]",
    "Encode a file to an image",
    (yargs) => {
      return yargs
        .positional("path", {
          describe: "path to the file you want to encode",
          type: "string"
        })
        .demandOption(["path"]);
    },
    async (argv) => {
      await encodeFile(argv.path);
    }
  )
  .command(
    "run [path]",
    "Run the code embedded into an image",
    (yargs) => {
      return yargs
        .positional("path", {
          describe: "path to the file you want to run",
          type: "string"
        })
        .demandOption(["path"]);
    },
    async (argv) => {
      await runImage(argv.path);
    }
  )
  .strictCommands()
  .demandCommand(1).argv;
