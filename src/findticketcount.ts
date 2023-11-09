import * as fs from 'fs';
import csvParser from 'csv-parser';
import * as csvWriter from 'csv-writer';

function processFiles(ticketIdsFile: string, navObjectsFile: string, outputFile: string, encoding: BufferEncoding) {
    // Load ticket IDs from CSV file
    const ticketIds: string[] = [];

    fs.createReadStream(ticketIdsFile)
        .pipe(csvParser())
        .on('data', (row: { 'Ticket ID': string }) => {
            ticketIds.push(row['Ticket ID']);
        })
        .on('end', () => {
            processNavObjects(navObjectsFile, ticketIds, outputFile, encoding);
        });
}

function processNavObjects(navObjectsFile: string, ticketIds: string[], outputFile: string, encoding: BufferEncoding) {
    // Define the regex patterns
    const objectPattern = new RegExp('^OBJECT (\\w+) (\\d+) (.+)$');
    const ticketIdPatterns: Record<string, RegExp> = {};

    ticketIds.forEach(ticketId => {
        ticketIdPatterns[ticketId] = new RegExp('\\'+ticketId+'\\b');
    });

    // Initialize variables
    let currentObjectType: string | null = null;
    let currentObjectNumber: string | null = null;
    let currentObjectName: string | null = null;
    const objectsTicketCounts: Record<string, number> = {};



    fs.createReadStream(navObjectsFile, { encoding: encoding })
        .on('data', (chunk: string) => {
            const lines = chunk.split('\n');
            lines.forEach(line => {
                const objectMatch = objectPattern.exec(line.trim());
                if (objectMatch) {
                    currentObjectType = objectMatch[1];
                    currentObjectNumber = objectMatch[2];
                    currentObjectName = objectMatch[3];
                }

                for (const ticketId of Object.keys(ticketIdPatterns)) {
                    if (ticketIdPatterns[ticketId].test(line) && currentObjectType && currentObjectNumber) {
                        const key = `${ticketId}=${currentObjectType}=${currentObjectNumber}=${currentObjectName}`;
                        objectsTicketCounts[key] = (objectsTicketCounts[key] || 0) + 1;
                    }
                }
            });
        })
        .on('end', () => {
            writeResultsToCsv(outputFile, objectsTicketCounts);
        });
}

function writeResultsToCsv(outputFile: string, objectsTicketCounts: Record<string, number>) {
    const csv = csvWriter.createObjectCsvWriter({
        path: outputFile,
        header: [
            { id: 'ticketId', title: 'Ticket ID' },
            { id: 'objectType', title: 'Object Type' },
            { id: 'objectNumber', title: 'Object Number' },
            { id: 'objectName', title: 'Object Name' },
            { id: 'count', title: 'Count' }
        ]
    });

    const records = Object.keys(objectsTicketCounts).map(key => {
        const [ticketId, objectType, objectNumber, objectName] = key.split('=');
        return {
            ticketId,
            objectType,
            objectNumber,
            objectName,
            count: objectsTicketCounts[key]
        };
    });

    csv.writeRecords(records).then(() => {
        console.log(`Results saved to ${outputFile}`);
    });
}

// Command-line argument handling
const args = process.argv.slice(2);
if (args.length < 3) {
    console.error('Please provide NAV objects filename, ticket CSV filename, object pattern, and encoding as arguments.');
    process.exit(1);
}

const [navObjectFilename, ticketFilename, outputFilename, encoding] = args as [string, string, string, BufferEncoding];
const result = processFiles(ticketFilename, navObjectFilename, outputFilename, encoding);

export { processFiles, processNavObjects, writeResultsToCsv};

