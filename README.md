# CodeQuest for VSCode

![Version badge](https://img.shields.io/badge/version-1.0.0-blue)
![Downloads badge](https://img.shields.io/badge/downloads-1k-brightgreen)

CodeQuest is a VSCode extension designed to assist developers during upgrade analysis. Its primary focus is to find ticket IDs, retrieve object details associated with those IDs, and quantify the number of occurrences of ticket IDs within each object.

## Features

1. **Find Ticket IDs in NAV Objects**: Search and highlight ticket IDs present in NAV Objects.
   
   - Command: `codequest.findTickets`
   - Title: `CodeQuest:Find Ticket IDs in NAV Objects`   

2. **Get the List of Tickets by Objects**: Quickly retrieve a list of ticket IDs associated with specific NAV Objects.

   - Command: `codequest.getTicketObjectList`
   - Title: `CodeQuest:Get the list of tickets by objects`   

3. **Get the Tickets Count by Objects**: Find out the number of times a specific ticket ID occurs within each NAV Object.

   - Command: `codequest.getTicketCountbyObjects`
   - Title: `CodeQuest:Get the tickets count by objects`   

## Requirements

- VSCode version 1.x or higher.

## Installation

1. Open the Extensions sidebar in VSCode.
2. Search for "CodeQuest".
3. Click the Install button.

## Usage

Simply use the commands listed above to harness the features of CodeQuest. 

For more in-depth usage instructions, contact javith2dj@gmail.com.

## Configuration

By default objects exported from NAV are Latin1 encoded. But you change the encoding in config.

## Known Issues



## Release Notes

### 1.0.0

- Initial release.
- Added primary features for finding ticket IDs, listing them by object, and getting their count by object.

For more release notes, check out the [CHANGELOG.md]

## License

This project is licensed under the MIT License. 
