# WeChatExporter: macOS WeChat Chat History Backup and Exporter Tool

## Project Overview

WeChatExporter is a specialized tool designed for backing up and reviewing WeChat chat histories on macOS. The primary purpose of this application is to provide users with a convenient method to export and preserve their WeChat conversations without requiring device jailbreaking.

### Key Features
- Export chat records from iOS devices
- Support for multiple message types:
  - Text messages
  - Voice messages
  - Images
  - Videos

### Main Benefits
- Preserves personal communication history
- No device jailbreaking required
- Simple, user-friendly interface
- Comprehensive chat record archiving

### Platform Support
- Primary platform: macOS
- Data source: iOS devices (with potential for future cross-platform expansion)

The project is built using Node.js with an AngularJS framework, offering a robust and flexible solution for personal chat record management and backup.

## Getting Started, Installation, and Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- macOS (currently the only supported operating system)
- Node.js (latest LTS version recommended)
- NW.js (version 0.40.1)
- Xcode (for compiling native dependencies)

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

3. Compile sqlite3 for NW.js:
   ```bash
   sudo npm install -g node-gyp
   npm install sqlite3 --build-from-source --runtime=node-webkit --target_arch=x64 --target=0.40.1
   ```

4. Run the application:
   ```bash
   /path/to/nwjs.app/Contents/MacOS/nwjs .
   ```

### Data Preparation

Before using the tool, you'll need to export your WeChat chat data:

1. Use iTunes to create a full iPhone backup (without encryption)
2. Use a third-party tool like iMazing to export the WeChat Documents folder
3. Ensure you have the exported data ready for the application

### Supported Platforms

- **Operating System**: macOS (primary support)
- **Data Source**: iOS devices (Android users can migrate chats to iPad first)

### Limitations

- Currently supports only iOS chat exports
- Requires manual compilation of some dependencies
- Limited cross-platform compatibility

## Features / Capabilities

### Core Features

#### Data Extraction and Export
- Export WeChat chat records without jailbreaking the device
- Support extracting chat history from iOS devices (MacOS only)
- Export various message types, including:
  - Text messages
  - Voice messages
  - Images
  - Videos
  - Contact cards
  - System messages
  - Location sharing
  - Shared links
  - Voice/video calls

#### Detailed Export Capabilities
- Granular export control with custom date range selection
- Preservation of original media files (audio, images, videos)
- Conversion of audio files from SILK format to MP3
- Auto-generation of thumbnails for images and videos
- Export of user profile information and avatars

#### Export Formats and Organization
- Creates a structured output directory with separate folders for:
  - Audio files
  - Images (with thumbnails)
  - Videos (with thumbnails)
  - User profile resources

#### Viewing and Analysis
- Interactive chat record browser
- Support for viewing exported chat records
- Configurable display options (lines per page, emoji display)
- Optional HTML export functionality

### Limitations
- Currently supports iOS system exports
- Requires MacOS for running the tool
- Manual configuration needed for different WeChat versions
- Limited cross-platform support

## Usage Examples

### Prerequisite Setup
Before using the WeChatExporter, ensure you have:
- MacOS system
- Node.js installed
- NW.js (Node-Webkit) downloaded
- iOS device with WeChat chat data

### Data Export Process
1. Create an iTunes backup of your iOS device
   - Ensure backup is **not encrypted**
2. Use a third-party tool like iMazing to export the WeChat Documents folder

### Software Installation
```bash
# Clone the repository
git clone https://github.com/tsycnh/WeChatExporter
cd WeChatExporter/development

# Install dependencies
npm install

# Compile sqlite3 (requires Xcode)
sudo npm install -g node-gyp
npm install sqlite3 --build-from-source --runtime=node-webkit --target_arch=x64 --target=0.40.1
```

### Running the Exporter
```bash
# Navigate to the development directory
cd development

# Launch the application (replace with your NW.js path)
/path/to/nwjs.app/Contents/MacOS/nwjs .
```

### Export Workflow
1. Click "Start Original Data Analysis"
2. Select a WeChat account
3. Choose a chat contact/group
4. Confirm chat details
5. Specify export directory and optional date range
6. Generate exported data
7. View exported chat records

### Viewing Exported Chats
1. Return to main page
2. Click "Show Chat Records"
3. Select the previously exported output directory
4. Browse through exported chat history

### Supported Content Types
- Text messages
- Voice messages
- Images
- Videos

**Note:** Currently supports iOS system exports only

## Project Structure

The project follows a structured development layout with several key directories:

### Development Directory
The primary working directory containing the core project files:
- `css/`: Stylesheet files
  - `qqemoji-origin.css`: Original emoji stylesheet
  - `qqemoji.css`: Processed emoji stylesheet
  - `style.css`: Main styling

- `framework/`: Third-party libraries and frameworks
  - `angularjs-1.6.1/`: AngularJS library files
  - `bootstrap-3.3.7/`: Bootstrap framework (CSS and JS)
  - `layer/`: UI layer library
  - Additional utility libraries like jQuery and debugout.js

- `imgs/`: Image assets
  - `face/`: Emoji and face icon images
  - `icon/`: Various interface icons
  - `icon-test/`: Test icons
  - `tutorial/`: Tutorial-related images

- `js/`: JavaScript source files
  - `app.js`: Main application configuration
  - `controller.js`: General controllers
  - `controller/`: Specific controllers (e.g., `chatDetail.js`, `chatList.js`)
  - `directive.js`: AngularJS directives
  - `filter.js`: Custom filters
  - `funcs.js`: Utility functions

- `resources/`: Static resources
  - Configuration and sample images
  - `qqemoji.json`: Emoji configuration
  - `qqemoji.png`: Emoji sprite image

- `templates/`: HTML template files
  - Various view templates for different application screens
  - Includes `chatDetail.html`, `chatList.html`, `index.html`, etc.

### Root Directory
- `LICENSE`: Project licensing information
- `README.md`: Project documentation
- `.gitignore`: Git ignore configuration

### Additional Directories
- `imgs/`: Additional image resources
- `test/`: Contains test-related files
- `imgs/for readme/`: Screenshots for documentation

### Build and Configuration
- `development/build.sh`: Shell script for build process
- `development/builder.js`: Build configuration
- `development/Gruntfile.js`: Grunt task configuration
- `development/package.json`: NPM package configuration

The project is primarily an AngularJS web application with a focus on chat-related functionality, utilizing multiple frameworks and libraries for enhanced user experience.

## Technologies Used

### Frontend Frameworks and Libraries
- AngularJS (1.6.1)
- Bootstrap (3.3.7)
- jQuery (3.1.1)
- UI Bootstrap
- Angular Route
- Angular Sanitize
- Angular UI Router

### Backend and Node.js Technologies
- Node.js (with NW.js/Node-Webkit)
- Express.js
- SQLite3
- Grunt (build tool)

### Utility Libraries
- fs-extra (file system operations)
- js-md5 (MD5 hashing)
- plist (property list parsing)
- systeminformation
- utf8

### Build and Development Tools
- Browserify
- NW.js Builder Phoenix
- Grunt (with various contrib plugins)
- Grunt Shell
- Grunt Usemin

### Additional Tools
- Layer.js (UI components)
- Silk V3 Decoder (audio/media processing)

## Additional Notes

### Project Status and Limitations
The project is currently in a maintenance state, with the following key considerations:

- The tool is primarily developed for macOS and has limited cross-platform support
- Currently supports iOS chat record exports with potential workarounds for Android users
- Project development is not actively maintained, but open to community contributions

### Known Constraints
- Only supports exporting chat records from iOS devices
- Requires specific setup with Node.js and NW.js
- Manual compilation of SQLite3 bindings may be necessary
- Limited message type support and export capabilities

### Performance and Compatibility
- Designed for personal chat record backup and review
- Supports export of text, voice, image, and video messages
- Performance may vary depending on the complexity and volume of chat records

### Future Development
While active development is paused, the project remains open to community improvements:

- Pull requests are welcome and will be reviewed promptly
- Potential future enhancements include:
  * Expanded platform support
  * More comprehensive message type handling
  * Improved user interface

### Community Engagement
- Project has gained significant community interest (600+ stars, 100+ forks)
- Encourages collaborative development and community-driven improvements

### Disclaimer
This is an unofficial tool for personal chat record management. Always respect privacy and terms of service when using such utilities.

## Contributing

We welcome and appreciate contributions to the WeChatExporter project! 

### How to Contribute

1. **Fork the Repository**
   - Create a fork of the project on GitHub
   - Clone your forked repository locally

2. **Create a Branch**
   - Create a new branch for your feature or bugfix
   - Use a clear and descriptive branch name

3. **Making Changes**
   - Ensure your code follows the existing project structure
   - Test your changes thoroughly
   - Keep your changes focused and concise

### Contribution Guidelines

#### Code Style
- Follow the existing code structure in the project
- Use consistent indentation and formatting
- Comment your code when necessary

#### Testing
- Verify that your changes do not break existing functionality
- If adding a new feature, include appropriate tests if possible

#### Reporting Issues
- Use the GitHub Issues section to report bugs or suggest improvements
- Provide detailed information, including:
  - Steps to reproduce the issue
  - Expected behavior
  - Actual behavior
  - Your environment details (OS, Node.js version, etc.)

### Pull Request Process
1. Ensure your code passes all existing tests
2. Update the README if your changes affect documentation
3. Include a clear description of your changes in the pull request
4. Your pull request will be reviewed by the maintainers

### Note
As mentioned by the project author, PRs are highly appreciated. While issue responses might be limited, pull requests will be reviewed promptly.

**Thank you for contributing!**

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). 

### Key License Terms
- You are free to use, modify, and distribute the software
- Any modifications must be shared under the same license
- There is no warranty for this free software
- Commercial use is permitted, but any distributed versions must also be open-sourced

A full copy of the license can be found in the [LICENSE](LICENSE) file in the project root.

For more details about the GNU General Public License, visit [https://www.gnu.org/licenses/gpl-3.0.en.html](https://www.gnu.org/licenses/gpl-3.0.en.html).