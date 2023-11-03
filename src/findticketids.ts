import * as fs from 'fs';
import * as csvWriter from 'csv-writer';


function extractTicketIds(filename: string, patternInput: string, encoding: BufferEncoding): Set<string> {
    const allPatterns = patternInput.split(',').map(p => p.trim());
    let allMatches = new Set<string>();

    for (const pattern of allPatterns) {
        const regex = new RegExp(pattern, 'g');
        const fileContents = fs.readFileSync(filename, encoding);
        const matches = fileContents.match(regex) || [];
        for (const match of matches) {
            const cleanedmatch = match.replace(/[&\/\\#,+()$~%'"*?<>{}]/g, '');
            allMatches.add(cleanedmatch);
        }
    }

    return allMatches;
}

function saveToCsv(ticketIds: Set<string>, outputFilename: string): void {
    const csv = csvWriter.createObjectCsvWriter({
        path: outputFilename,
        header: [{ id: 'ticketId', title: 'Ticket ID' }]
    });

    const records = Array.from(ticketIds).map(ticketId => ({ ticketId }));
    csv.writeRecords(records).then(() => {
        console.log(`Ticket IDs saved to ${outputFilename}`);
    });
}

// This will be your command-line argument handler.
const args = process.argv.slice(2);
if (args.length < 3) {
    console.error('Please provide filename, output file, and pattern as arguments.');
    process.exit(1);
}

const [filename, output_file, pattern] = args;
const encoding: BufferEncoding = args[3] as BufferEncoding;

const result = extractTicketIds(filename, pattern, encoding);
saveToCsv(result, output_file);

export { extractTicketIds, saveToCsv };

