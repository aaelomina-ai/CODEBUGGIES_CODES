/**
 * quizQuestions
 * -------------
 * All Learning Hub quiz content lives here so it can be edited without
 * touching QuizScreen.jsx. To add a question, push another object onto
 * the relevant `[language][difficulty]` array — no other file needs
 * to change.
 *
 * Shape of one question:
 *   {
 *     prompt: string,          // shown above the code/options
 *     code: string | null,     // optional code snippet, monospace block
 *     options: string[],       // exactly 4 choices
 *     correctIndex: number,    // 0-3, index into options
 *   }
 *
 * QUIZ_QUESTIONS_BY_LANGUAGE[language][difficulty] must exist for every
 * language in GameSelectScreen's LANGUAGE_CARDS and every difficulty in
 * progressService's DIFFICULTIES, or QuizScreen falls back to
 * javascript/beginner (see the fallback in QuizScreen.jsx).
 */

export const POINTS_PER_CORRECT = 100;
export const QUESTION_TIME_MS = 20000; // 20s per question
export const PASSING_RATIO = 0.65; // ~2 of 3 correct clears a tier

export const QUIZ_QUESTIONS_BY_LANGUAGE = {
  python: {
    beginner: [
      {
        prompt: "What is the output of this code?",
        code: "print(2 + 3 * 2)",
        options: ["10", "8", "12", "7"],
        correctIndex: 1,
      },
      {
        prompt: "Which keyword defines a function in Python?",
        code: null,
        options: ["func", "def", "function", "void"],
        correctIndex: 1,
      },
      {
        prompt: "What data type is the value True?",
        code: null,
        options: ["int", "bool", "str", "float"],
        correctIndex: 1,
      },
    ],
    intermediate: [
      {
        prompt: "What does this return?",
        code: "len([1, 2, 3])",
        options: ["2", "3", "4", "Error"],
        correctIndex: 1,
      },
      {
        prompt: "What does this output?",
        code: "list(range(3))",
        options: ["[0, 1, 2]", "[1, 2, 3]", "[0, 1, 2, 3]", "[3]"],
        correctIndex: 0,
      },
      {
        prompt: "Which method adds an item to the end of a list?",
        code: null,
        options: [".push()", ".append()", ".add()", ".insert(0)"],
        correctIndex: 1,
      },
    ],
    hard: [
      {
        prompt: "What is the output of this list comprehension?",
        code: "[x**2 for x in range(3)]",
        options: ["[0, 1, 4]", "[1, 4, 9]", "[0, 1, 2]", "Error"],
        correctIndex: 0,
      },
      {
        prompt: "What does *args let a function accept?",
        code: null,
        options: [
          "A fixed number of arguments",
          "A variable number of positional arguments",
          "Only keyword arguments",
          "Nothing — it's invalid syntax",
        ],
        correctIndex: 1,
      },
      {
        prompt: "What does this print?",
        code: 'try:\n    1 / 0\nexcept ZeroDivisionError:\n    print("caught")',
        options: ["caught", "The program crashes", "0", "None"],
        correctIndex: 0,
      },
    ],
  },

  javascript: {
    beginner: [
      {
        prompt: "What does this return?",
        code: 'typeof "hello"',
        options: ["string", "number", "object", "undefined"],
        correctIndex: 0,
      },
      {
        prompt: "Which keyword declares a block-scoped variable?",
        code: null,
        options: ["var", "let", "global", "static"],
        correctIndex: 1,
      },
      {
        prompt: "What does this print?",
        code: 'console.log(2 === "2")',
        options: ["true", "false", "2", "Error"],
        correctIndex: 1,
      },
    ],
    intermediate: [
      {
        prompt: "What does this return?",
        code: "[1, 2, 3].map(x => x * 2)",
        options: ["[1, 2, 3]", "[2, 4, 6]", "[2, 3, 4]", "Error"],
        correctIndex: 1,
      },
      {
        prompt: "What does this print?",
        code: "console.log(typeof NaN)",
        options: ["number", "NaN", "undefined", "object"],
        correctIndex: 0,
      },
      {
        prompt: "Which array method removes the last element?",
        code: null,
        options: [".shift()", ".pop()", ".slice()", ".splice(0)"],
        correctIndex: 1,
      },
    ],
    hard: [
      {
        prompt: "What does `this` refer to inside an arrow function?",
        code: null,
        options: [
          "A brand-new object",
          "The enclosing lexical scope's this",
          "undefined, always",
          "The global window object only",
        ],
        correctIndex: 1,
      },
      {
        prompt: "What is a Promise?",
        code: null,
        options: [
          "A loop construct",
          "An object representing the eventual result of an async operation",
          "A synchronous function",
          "A numeric data type",
        ],
        correctIndex: 1,
      },
      {
        prompt: "What does Object.freeze(obj) do?",
        code: null,
        options: [
          "Deletes the object",
          "Prevents adding, removing, or modifying its properties",
          "Deep-clones the object",
          "Converts it to JSON",
        ],
        correctIndex: 1,
      },
    ],
  },

  java: {
    beginner: [
      {
        prompt: "Which keyword creates a class?",
        code: null,
        options: ["class", "struct", "object", "define"],
        correctIndex: 0,
      },
      {
        prompt: "What is the correct file extension for Java source files?",
        code: null,
        options: [".jav", ".java", ".jv", ".js"],
        correctIndex: 1,
      },
      {
        prompt: "Which method is the entry point of a Java program?",
        code: null,
        options: ["start()", "main()", "run()", "init()"],
        correctIndex: 1,
      },
    ],
    intermediate: [
      {
        prompt: "What does this create?",
        code: "int[] arr = new int[5];",
        options: [
          "An array of 5 integers, each defaulting to 0",
          "An empty array",
          "A list of 5 strings",
          "A compile error",
        ],
        correctIndex: 0,
      },
      {
        prompt: "Which keyword prevents a class from being extended?",
        code: null,
        options: ["static", "private", "final", "const"],
        correctIndex: 2,
      },
      {
        prompt: "What does this print?",
        code: "System.out.println(7 / 2);",
        options: ["3.5", "3", "4", "Error"],
        correctIndex: 1,
      },
    ],
    hard: [
      {
        prompt: "What does the synchronized keyword do?",
        code: null,
        options: [
          "Speeds up loops",
          "Ensures only one thread executes a block at a time",
          "Declares a constant",
          "Imports a package",
        ],
        correctIndex: 1,
      },
      {
        prompt: "Which interface must a class implement to be used in a for-each loop?",
        code: null,
        options: ["Iterable", "Comparable", "Serializable", "Runnable"],
        correctIndex: 0,
      },
      {
        prompt: "What is method overriding?",
        code: null,
        options: [
          "Defining multiple methods with the same name but different parameters",
          "Redefining a parent class method in a subclass with the same signature",
          "Deleting a method",
          "Making a method private",
        ],
        correctIndex: 1,
      },
    ],
  },

  cpp: {
    beginner: [
      {
        prompt: "Which header is needed for cout?",
        code: null,
        options: ["<stdio.h>", "<iostream>", "<string>", "<vector>"],
        correctIndex: 1,
      },
      {
        prompt: "What symbol ends most C++ statements?",
        code: null,
        options: [":", ";", ".", ","],
        correctIndex: 1,
      },
      {
        prompt: "Which keyword declares a constant?",
        code: null,
        options: ["let", "const", "final", "static"],
        correctIndex: 1,
      },
    ],
    intermediate: [
      {
        prompt: "What does this do?",
        code: "int* p = &x;",
        options: [
          "Declares a normal integer",
          "Declares a pointer storing the address of x",
          "Declares a reference to x",
          "Causes a compile error",
        ],
        correctIndex: 1,
      },
      {
        prompt: "What does this print?",
        code: "cout << 7 % 2;",
        options: ["3", "1", "0", "3.5"],
        correctIndex: 1,
      },
      {
        prompt: "Which syntax is used for inheritance?",
        code: null,
        options: ["extends", "inherits", ": public", "implements"],
        correctIndex: 2,
      },
    ],
    hard: [
      {
        prompt: "What does RAII relate to?",
        code: null,
        options: ["A sorting algorithm", "Resource Acquisition Is Initialization", "A memory leak", "A type of loop"],
        correctIndex: 1,
      },
      {
        prompt: "What is a virtual function used for?",
        code: null,
        options: ["Speeding up compilation", "Enabling runtime polymorphism", "Declaring constants", "Preventing inheritance"],
        correctIndex: 1,
      },
      {
        prompt: "What does nullptr represent?",
        code: null,
        options: ["Zero", "A null pointer constant", "An uninitialized variable", "A syntax error"],
        correctIndex: 1,
      },
    ],
  },
};