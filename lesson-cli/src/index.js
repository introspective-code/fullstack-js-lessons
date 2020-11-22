import arg from "arg";
import inquirer from "inquirer";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--inputA": Number,
      "--inputB": Number,
      "--operator": String,
      "-a": "--inputA",
      "-b": "--inputB",
      "-o": "--operator"
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    inputA: args['--inputA'],
    inputB: args['--inputB'],
    operator: args['--operator']
  };
}

async function promptForMissingOptions(options) {
  const questions = [];

  if (!options.inputA || isNaN(options.inputA)) {
    questions.push({
      type: "number",
      name: "inputA",
      message: "Please enter a number.",
      default: 1,
    });
  }

  if (!options.inputB || isNaN(options.inputB)) {
    questions.push({
      type: "number",
      name: "inputB",
      message: "Please enter a number.",
      default: 1,
    });
  }

  if (!options.operator) {
    questions.push({
      type: "list",
      name: "operator",
      message: "Please pick an operator.",
      choices: ['+', '-', '/', 'x'],
      default: '+',
    });
  }

  if (!options.operator) {
    questions.push({
      type: "list",
      name: "operator",
      message: "Please pick an operator.",
      choices: ['+', '-', '/', 'x'],
      default: '+',
    });
  }

  let answers = await inquirer.prompt(questions);

  while (isNaN(answers.inputA) || isNaN(answers.inputB)) {
    answers = await inquirer.prompt(questions);
  }

  return {
    ...options,
    inputA: options.inputA || answers.inputA,
    inputB: options.inputB || answers.inputB,
    operator: options.operator || answers.operator,
  };
}

export function handleOptions(options) {
  const { inputA, inputB, operator } = options;
  let result;

  switch (operator) {
    case '-':
      result = inputA - inputB;
      break;
    case '/':
      result = inputA / inputB;
      break;
    case 'x':
      result = inputA * inputB;
      break;
    default:
      result = inputA + inputB
      break;
  }

  console.log(`${inputA} ${operator} ${inputB} = ${result}`);
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  handleOptions(options);
}