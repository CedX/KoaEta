import {env} from "node:process";
import {startProcess, writeOutput} from "./Tools.js";

env.NODE_ENV = "Testing";
writeOutput("Running the test suite...");
startProcess("npx tsc --build Sources/tsconfig.json --sourceMap");
startProcess("npx mocha --config Configuration/Mocha.js --file Tests/Should.js Tests");
