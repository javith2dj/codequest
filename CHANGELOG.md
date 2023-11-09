# Changelog

All notable changes to the "CodeQuest" extension will be documented in this file.


## [1.1.5] - 2023-11-10
### Fixed
- Resolved a bug where ticket ids with same substring are counted together

## [1.1.0] - 2023-11-05
### Added
- New command `codequest.getTicketCountbyObjects` to fetch the ticket counts by objects.
- Enhancement in `codequest.findTickets` to provide a more detailed summary.
- Option to export ticket data in JSON format.

### Changed
- Improved performance of `codequest.getTicketObjectList` by 15%.
- Updated UI elements for better user experience.

### Fixed
- Resolved a bug where `codequest.findTickets` would sometimes return duplicate entries.
- Fixed minor typos in the user interface.

## [1.0.5] - 2023-11-03
### Fixed
- Addressed an issue where the extension would crash on large NAV object files.

### Changed
- Optimized memory usage for large ticket lists.

## [1.0.0] - 2023-11-02
### Added
- Initial release with features:
  - `codequest.findTickets`: Find Ticket IDs in NAV Objects.
  - `codequest.getTicketObjectList`: Get the list of tickets by objects.
  
### Known Issues
- Occasionally slow on very large NAV object files.