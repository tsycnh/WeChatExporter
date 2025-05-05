# WeChatExporter: A Comprehensive macOS Tool for WeChat Chat Record Preservation and Export

## Project Overview

WeChatExporter is a specialized macOS application designed to export and preserve WeChat chat records without requiring device jailbreaking. The tool enables users to backup and review their chat history comprehensively, supporting multiple media types directly on their computer.

### Key Features
- Export chat records from iOS devices
- Support for multiple message types:
  - Text messages
  - Voice recordings
  - Images
  - Videos
- Preserve chat history across different time periods
- User-friendly two-step export and review process

### Core Capabilities
The application provides a seamless solution for users who want to:
- Create personal chat record backups
- Review historical conversations
- Preserve important communication memories
- Export chat data without risking data loss

### Technical Approach
- Built using Node.js
- Frontend framework: AngularJS
- Platform support: macOS (with potential for future cross-platform expansion)
- Data parsing through SQLite database interaction

### Unique Benefits
- No device jailbreaking required
- Intuitive interface for data export and browsing
- Preserves complete conversation context
- Supports selective date range exports

## Getting Started, Installation, and Setup

### Prerequisites

Before getting started, ensure you have the following installed:
- Node.js (version 8.11.3 or 10.16.3 recommended)
- NW.js (version 0.32.1 or 0.40.1)
- macOS (primary supported platform)
- Xcode (for building dependencies)

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/tsycnh/WeChatExporter
   cd WeChatExporter/development
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile SQLite3 for NW.js:
   ```bash
   # Install node-gyp
   sudo npm install -g node-gyp

   # Compile sqlite3 (example for NW.js v0.40.1, 64-bit)
   npm install sqlite3 --build-from-source --runtime=node-webkit --target_arch=x64 --target=0.40.1
   ```

### Data Preparation

#### iOS Data Export
1. Use iTunes to backup your entire iPhone device (ensure backup is NOT encrypted)
2. Use third-party software like iMazing to export the Documents folder containing WeChat backup data

### Running the Application

1. Start the application:
   ```bash
   /path/to/nwjs.app/Contents/MacOS/nwjs .
   ```

### Important Notes

- Currently supports iOS systems primarily
- Application runs only on macOS
- Android and Windows users can migrate chat records to iPad for export

### Troubleshooting

- Verify NW.js and Node.js versions match
- Check runtime logs via [Tools] -> [Export Runtime Logs]
- Ensure all dependencies are correctly compiled for your specific platform

## Features / Capabilities

The WeChatExporter is a comprehensive tool for exporting and viewing WeChat chat records with the following core features:

#### Chat Record Export
- Export chat records from iOS devices
- Support for exporting multiple message types:
  - Text messages
  - Voice messages
  - Images
  - Videos
- Flexible export options:
  - Select specific date ranges for chat history
  - Export messages from specific contacts
  - Export entire chat history

#### Chat Record Viewer
- View exported chat records in a structured interface
- Display detailed chat history
- Support for browsing:
  - Individual chat conversations
  - Group chat conversations
- User-friendly chat navigation

#### Advanced Features
- User avatar and nickname display
- Searchable chat records
- Multiple display modes for chat content
- Support for viewing conversations with high message volumes (100+ messages)

#### Platform Compatibility
- Currently supports:
  - macOS
  - iOS chat record export
  - Potential workarounds for Android (via iPad migration)

#### Technical Capabilities
- Utilizes Node.js and AngularJS frameworks
- SQLite database parsing
- Exports chat records to a structured output directory

### Limitations
- Currently macOS-only
- iOS-centric export process
- Limited cross-platform support

## Usage Examples

### Data Export Process

1. Prepare WeChat Chat Data
   - For iOS devices, use iTunes to backup the entire device (do NOT encrypt the backup)
   - Alternatively, use third-party software like iMazing to export the Documents folder

2. Export Chat Records
   ```bash
   # Clone the project
   git clone https://github.com/tsycnh/WeChatExporter
   
   # Navigate to the project directory
   cd WeChatExporter/development
   
   # Install dependencies
   npm install
   ```

3. Compile SQLite3 (for macOS)
   ```bash
   # Install Xcode from App Store
   sudo npm install -g node-gyp
   
   # Compile sqlite3 (adjust target based on your nwjs version)
   npm install sqlite3 --build-from-source --runtime=node-webkit --target_arch=x64 --target=0.40.1
   ```

### Running the Exporter

1. Start the Application
   ```bash
   # Run with nwjs (replace path with your nwjs installation)
   /path/to/nw/nwjs.app/Contents/MacOS/nwjs .
   ```

2. Export Workflow
   - Click "Start Original Data Analysis"
   - Select the WeChat account
   - Choose chat partner (default shows chats with >100 messages)
   - Confirm chat by reviewing recent messages
   - Set export directory and optional date range
   - Generate exported data

3. View Exported Chat Records
   - Return to main page
   - Click "Show Chat Records"
   - Select the previously exported output directory

### Practical Tips
- Supports exporting text, voice, images, and videos
- Currently optimized for macOS and iOS
- Exports chat records without jailbreaking the device

### Troubleshooting
- Check logs via Tools -> Export Run Logs
- Verify nwjs and nodejs version compatibility
- Refer to documentation if encountering issues

## Technologies Used

### Frontend Technologies
- **Angular.js** (v1.6.1): Core JavaScript framework for building dynamic web applications
  - Includes routing, sanitization, and UI router modules
- **Bootstrap** (v3.3.7): Responsive CSS framework for modern, mobile-first design
- **jQuery** (v3.1.1): Cross-platform JavaScript library for DOM manipulation

### UI/UX Libraries
- **Layer.js**: Enhanced UI interaction and modal management
- **UI Bootstrap**: Angular-powered UI component library

### Build and Development Tools
- **Grunt.js**: Automated task runner for build processes
- **Node.js**: JavaScript runtime for development and build tooling

### Multimedia and Utility Libraries
- **Silk V3 Decoder**: Specialized audio decoding library
- **FFmpeg**: Comprehensive multimedia framework for audio/video processing

### Platform/Runtime
- **Node-Webkit**: Desktop application framework for web technologies
- **SQLite3**: Lightweight, serverless database engine

## Additional Notes

### Project Maintenance Status
The project is currently in a maintenance mode, with limited active development. The original author acknowledges several known limitations and potential improvements:

- Limited platform support (primarily macOS and iOS)
- Incomplete message type coverage
- Complex setup process for new users

### Compatibility Constraints
- Operating System: macOS (primary support)
- Data Source: iOS WeChat backups
- Alternative iOS Backup Methods: 
  - Use iTunes for full device backup
  - Use third-party tools like iMazing to export WeChat Documents folder

### Known Limitations
- Does not support Windows or Android platforms natively
- Requires technical knowledge for setup and compilation
- Relies on specific Node.js and NW.js versions
- Manual compilation of SQLite3 bindings may be necessary

### Future Development
The project is open to community contributions. The maintainer encourages:
- Pull Requests for improvements
- Issue reporting with detailed environment information
- Community-driven development and platform expansion

### Potential Improvements
- Multi-platform support
- Enhanced message type handling
- Simplified installation process
- HTML export functionality

### Community Involvement
While direct issue responses may be limited, the project welcomes:
- Community-driven development
- Open-source collaboration
- Constructive pull requests

#### Recommended Approach for Non-Chinese Users
If you're a non-Chinese user interested in using the tool, the project maintainer recommends opening an issue to discuss potential localization efforts.

## Contributing

We welcome contributions to the project! Here are some guidelines to help you get started:

### How to Contribute

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Ensure your code follows the project's coding standards
5. Write tests for new functionality if applicable
6. Submit a pull request with a clear description of your changes

### Development Setup

- The project uses Node.js and requires Node Package Manager (npm)
- Main dependencies include:
  - AngularJS 1.6.1
  - Bootstrap 3.3.7
  - Grunt for build tasks
- Use `npm install` to set up development dependencies
- Use `npm start` to run the application locally

### Code Style Guidelines

- Follow existing code formatting in the project
- Use JSHint for linting (configuration in project files)
- Write clear, concise comments
- Keep functions and methods focused and modular

### Testing

- Currently, no specific test suite is defined
- Manually test any new features or changes thoroughly
- Ensure no existing functionality is broken by your modifications

### Reporting Issues

- Use GitHub Issues to report bugs or suggest improvements
- Provide detailed information about the issue
- Include steps to reproduce, expected behavior, and actual behavior

### Pull Request Process

- Ensure your code passes all existing checks
- Update documentation as needed
- Your pull request will be reviewed by the maintainers
- Be open to feedback and potential requested changes

## License

This project is licensed under the GNU General Public License v3.0 (GPLv3).

### Key Licensing Terms

- You are free to use, modify, and distribute this software
- Any modifications must be shared under the same license
- Commercial use is permitted
- There is no warranty provided with this software

### Full License Details

The complete license text is available in the [LICENSE](LICENSE) file in the project root.

### Key Permissions
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Patent use
- ❌ Private use without sharing modifications

### Conditions
- Source code must be made available when distributing
- Original license and copyright notices must be preserved
- Changes must be documented

For the complete and authoritative license terms, please refer to the full [LICENSE](LICENSE) file.