import * as fs from 'fs';
import * as path from 'path';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

interface ModificationCounters {
    PropertyModification: number;
    CodeModification: number;
    Insertion: number;
    Deletion: number
}

interface CsvData extends ModificationCounters {
    ObjectType: string;
    ObjectNumber: string;
    ObjectName: string;
}

function parseObjectDetails(line: string): [string, string, string] {
    // Initialize variables to store object details
    let objectType = '';
    let objectNumber = '';
    let objectName = '';

    // Pattern for line with "Modification" which may or may not include quotes
    const modificationPattern = /OBJECT Modification (?:\"(.+?)\"|\b(\w+)\b)\((\w+) (\d+)\)/;
    const modificationMatch = line.match(modificationPattern);
    
    // Pattern for line without "Modification"
    const standardPattern = /OBJECT (\w+) (\d+) (.+)/;
    const standardMatch = line.match(standardPattern);

    if (modificationMatch) {
        objectName = modificationMatch[1] || modificationMatch[2];
        objectType = modificationMatch[3];
        objectNumber = modificationMatch[4];
    } else if (standardMatch) {
        objectType = standardMatch[1];
        objectNumber = standardMatch[2];
        objectName = standardMatch[3];
    }

    // Trim the objectName to remove any leading or trailing whitespace
    objectName = objectName.trim();

    return [objectType, objectNumber, objectName];
}

function countModifications(filePath: string): [ModificationCounters, [string, string, string]] {
    const counters: ModificationCounters = {
        PropertyModification: 0,
        CodeModification: 0,
        Insertion: 0, 
        Deletion: 0
    };

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const firstLine = lines.shift() || '';

    lines.forEach(line => {
        for (const modType in counters) {
            if (line.includes(modType)) {
                counters[modType as keyof ModificationCounters]++;
            }
        }
    });

    return [counters, parseObjectDetails(firstLine)];
}

function processDirectory(directoryPath: string, outputCsv: string) {
    const allData: CsvData[] = [];

    fs.readdirSync(directoryPath).forEach(filename => {
        if (filename.endsWith('.DELTA')) {
            const filePath = path.join(directoryPath, filename);
            const [counts, [objectType, objectNumber, objectName]] = countModifications(filePath);
            const data: CsvData = {
                ...counts,
                ObjectType: objectType,
                ObjectNumber: objectNumber,
                ObjectName: objectName
            };
            allData.push(data);
        }
    });

    const csvWriter = createCsvWriter({
        path: outputCsv,
        header: [
            { id: 'ObjectType', title: 'ObjectType' },
            { id: 'ObjectNumber', title: 'ObjectNumber' },
            { id: 'ObjectName', title: 'ObjectName' },
            { id: 'PropertyModification', title: 'PropertyModification' },
            { id: 'CodeModification', title: 'CodeModification' },
            { id: 'Insertion', title: 'Insertion' }, 
            { id: 'Deletion', title: 'Deletion' }// Add more fields if needed
        ]
    });

    csvWriter.writeRecords(allData)
        .then(() => console.log(`Data written to ${outputCsv}`))
        .catch(err => console.error('Error writing CSV:', err));
}


// Command-line argument handling
const args = process.argv.slice(2);
if (args.length < 2) {
    console.error('Please provide DELTA path and output CSV filename.');
    process.exit(1);
}

const [deltafilepath, outputFilename] = args as [string, string];
const result = processDirectory(deltafilepath, outputFilename);

export { parseObjectDetails, countModifications, processDirectory};
