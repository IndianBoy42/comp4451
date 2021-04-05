import * as readline from "readline";
export function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve =>
        rl.question(query, ans => {
            rl.close();
            resolve(ans);
        })
    );
}

//set this to true to randomize all actions for testing
export const DEBUG_RNG_INPUT = false;
export const DEBUG_CONSOLE_INPUT = false;

export async function askIntInput(query, min, max) {
    if (DEBUG_RNG_INPUT) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (DEBUG_CONSOLE_INPUT) {
        while (true) {
            const ans = await askQuestion(query);
            const input = parseInt(ans);
            if (input >= min && input <= max) return input;
            console.log("Invalid input range!");
        }
    }

    // Real GUI Input
}
