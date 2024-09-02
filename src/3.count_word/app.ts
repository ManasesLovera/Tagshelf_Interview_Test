/*
3. Implementa un script en Node.js que lea un archivo de texto grande (sí, de esos que
pesan varios GB) línea por línea y realice las siguientes tareas:

    ● Cuenta cuántas veces aparece cada palabra única en el archivo (ya sabes, para que te
    des cuenta de cuántas veces se repite "the").
    ● Muestra las 10 palabras más frecuentes y sus respectivos conteos, porque ¿quién no
    querría saber eso?
    ● Todo esto considerando la eficiencia de memoria y usando streams para evitar que tu
    máquina colapse por intentar cargar todo el archivo en la RAM.
    
    Bonus:
        ● Utiliza worker threads para paralelizar el procesamiento de varios archivos al
        mismo tiempo, asegurando que el uso de la CPU esté al máximo de su
        capacidad (pero sin freírla, por favor).
        ● Maneja los errores con gracia y estilo, asegurando que el proceso pueda
        continuar incluso si uno de los archivos se niega a cooperar.

        Descarga el siguiente libro de Project Gutenberg para hacer pruebas.
*/

import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import readline from 'readline';
import WordCount from './wordcount';
import OrderedList from './orderedlist';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

async function countWords(filePath: string) {

    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    })

    let result: OrderedList<WordCount> = new OrderedList<WordCount>();

    for await (const line of rl) {
        line.split(/[\s\r\n]+/).forEach(word => 
            result.set(word.toLowerCase().replace(/[.,]$/, '')))
    }
    const response = {
        count: result.count,
        topTen: result.get(10),
        allWords: result.getAll()
    };
    return response;
}

app.get('/count_words', async (_req: Request, res: Response) => {

    const filePath = path.join(__dirname, 'text.txt');

    try {
        const response = await countWords(filePath);
        res.send(response)
    }
    catch (error) {
        res.status(500).send('Error reading file');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})