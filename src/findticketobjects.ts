import * as fs from 'fs';
import csvParser from 'csv-parser';
import * as csvWriter from 'csv-writer';

function extractObjectsUsingInterfaces(
    navObjectFilename: string, 
    ticketFilename: string,    
    encoding: BufferEncoding
): Promise<Array<[string, string, string, string]>> {
    return new Promise((resolve, reject) => {
        // Load interfaces from CSV file
        const interfaces: string[] = [];
        fs.createReadStream(ticketFilename)
            .pipe(csvParser())
            .on('data', (row: { 'Ticket ID': string }) => {
                interfaces.push(row['Ticket ID']);
            })
            .on('end', () => {
                console.log('CSV file successfully processed.');

                const objectPatternStr = '^OBJECT (\\w+) (\\d+) (.+)$';
                const objectPattern = new RegExp(objectPatternStr);
                let currentObjectType: string | null = null;
                let currentObjectNumber: string | null = null;
                let currentObjectName: string | null = null;
                const objectsUsingInterfaces: Array<[string, string, string, string]> = [];

                const fileContents = fs.readFileSync(navObjectFilename, encoding).toString();
                const lines = fileContents.split('\n');
                for (const line of lines) {
                    objectPattern.lastIndex = 0; // Reset the regex state
                    const objectMatch = objectPattern.exec(line.trim());
                    if (objectMatch) {
                        currentObjectType = objectMatch[1];
                        currentObjectNumber = objectMatch[2];
                        currentObjectName = objectMatch[3];
                    }

                    for (const interfaceItem of interfaces) {
                        if (line.includes(interfaceItem) && currentObjectType && currentObjectNumber) {
                            if (currentObjectName === null) {
                                currentObjectName = '';
                            }
                            objectsUsingInterfaces.push([interfaceItem, currentObjectType, currentObjectNumber, currentObjectName]);
                            break;  // Break here after first match
                        }
                    }
                }

                resolve(objectsUsingInterfaces);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

function saveToCsv(objects: Array<[string, string, string, string]>, outputFilename: string): void {
    const csv = csvWriter.createObjectCsvWriter({
        path: outputFilename,
        header: [
            { id: 'interfaceName', title: 'Interface Name' },
            { id: 'objectType', title: 'Object Type' },
            { id: 'objectNumber', title: 'Object Number' },
            { id: 'objectName', title: 'Object Name' }
        ]
    });

    const records = objects.map(([interfaceItem, objType, objNumber, objName]) => ({
        interfaceName: interfaceItem,
        objectType: objType,
        objectNumber: objNumber,
        objectName: objName
    }));

    csv.writeRecords(records).then(() => {
        console.log(`Results saved to ${outputFilename}`);
    });
}

// Command-line argument handling
const args = process.argv.slice(2);
if (args.length < 3) {
    console.error('Please provide NAV objects filename, ticket CSV filename, object pattern, and encoding as arguments.');
    process.exit(1);
}

const [navObjectFilename, ticketFilename, outputFilename, encoding] = args as [string, string, string, BufferEncoding];
extractObjectsUsingInterfaces(navObjectFilename, ticketFilename, encoding).then(result => {
    saveToCsv(result, outputFilename);
}).catch(error => {
    console.error(`Error processing files: ${error.message}`);
});

export { extractObjectsUsingInterfaces, saveToCsv };
