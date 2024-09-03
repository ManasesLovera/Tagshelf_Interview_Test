import { parentPort, workerData } from 'worker_threads';
import fs from 'fs';
import readline from 'readline';

// Define the type for worker data
interface WorkerData {
    filePath: string;
    start: number;
    end: number;
}

// Define the type for the result returned by the worker
interface WordCountResult {
    [word: string]: number;
}

// Function to count words in a given file chunk
async function countWords(filePath: string, start: number, end: number): Promise<WordCountResult> {
    const fileStream = fs.createReadStream(filePath, { start, end });
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    const wordCounts = new Map<string, number>();
    for await (const line of rl) {
        const words = line.split(/\s+/);
        words.forEach(word => {
            word = word.toLowerCase().replace(/[.,!?;:]/g, '');
            if (word) {
                wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
            }
        });
    }

    return Object.fromEntries(wordCounts);
}

// Get worker data from workerData
const { filePath, start, end }: WorkerData = workerData;

countWords(filePath, start, end)
    .then(result => parentPort?.postMessage(result))
    .catch(err => parentPort?.postMessage({ error: err.message }));
