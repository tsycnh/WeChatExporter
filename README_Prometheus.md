# WechatExporter: A Cross-Platform WeChat Chat History Backup and Export Tool

## Getting Started, Installation, and Setup

### Prerequisites

Before getting started, ensure you have the following installed:
- Node.js (version compatible with dependencies in package.json)
- npm (Node Package Manager)
- NW.js (version 0.40.1, as specified in package.json)

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-repo/WechatExporter.git
cd WechatExporter/development
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

#### Development Mode
To run the application in development mode:
```bash
npm start
```

#### Building for Distribution
To build distributions for multiple platforms:
```bash
npm run dist
```

This will create builds for:
- Windows 32-bit
- Windows 64-bit
- Linux 32-bit
- Linux 64-bit
- macOS 64-bit

### Platform-Specific Notes

#### macOS
- Use the provided build script for macOS specific build:
```bash
./build.sh
```
- This creates a macOS application bundle with custom icon

### Dependency Details

Key dependencies include:
- Express for web server functionality
- SQLite for database operations
- Browserify for module bundling
- Various Grunt plugins for build and asset management

### Troubleshooting

- Ensure all dependencies are correctly installed
- Check Node.js and npm versions compatibility
- Verify NW.js version matches 0.40.1
- For file access issues, the application uses `-allow-file-access-from-files` Chromium argument

## Deployment

The application is designed as a desktop application using NW.js (Node-Webkit) and can be deployed across multiple platforms.

### Deployment Platforms
- Windows (x86 and x64)
- Linux (x86 and x64)
- macOS (x64)

### Deployment Commands
To build the application for distribution, use the following npm script:
```bash
npm run dist
```

This command will generate builds for:
- Windows x86
- Windows x64
- Linux x86
- Linux x64
- macOS x64

#### macOS-Specific Build
For macOS-specific builds, you can use the included `build.sh` script:
```bash
./build.sh
```

### Deployment Notes
- The application requires NW.js version 0.40.1
- Builds are generated using nwjs-builder-phoenix
- The application uses a Chromium-based runtime with custom arguments to allow file access

### Runtime Requirements
- Node.js
- NW.js runtime
- Platform-specific dependencies as listed in the package.json file

## Feature Highlights

The application is a WeChat Backup viewer and management tool with the following core features:

#### File Import and Selection
- Import SQLite database files containing WeChat chat history
- Browse and select specific chat conversations for export and viewing

#### Chat Conversation Management
- View comprehensive chat lists across different conversations
- Explore detailed chat histories with full message context
- Support for both individual and group chat conversations

#### Export and Visualization
- Generate HTML exports of chat conversations
- Configurable export options including:
  - Custom output paths
  - Emoji rendering
  - Pagination control

#### Multi-Stage Navigation
- Intuitive, multi-step workflow for chat backup processing
- Distinct application states for different stages of backup exploration:
  - New Entry Point
  - File Selection
  - Chat List
  - Chat Details
  - Additional Utility Screens

#### Enhanced User Experience
- Responsive UI with top navigation bar
- State-based routing using UI-Router
- Support for back navigation between application states
- Inline image and emoji support in chat views

## Project Structure

The project follows a structured development approach with several key directories:

### Development Directory
The `development/` directory serves as the primary source code and resource location:

#### Source Code
- `js/`: Contains core JavaScript files
  - `app.js`: Main application configuration
  - `controller.js`: Primary application controllers
  - `controller/`: Specific view controllers
    - `chatDetail.js`: Logic for chat details view
    - `chatList.js`: Logic for chat list view
  - `directive.js`: Custom Angular directives
  - `filter.js`: Custom Angular filters
  - `funcs.js`: Utility functions

#### Templates
- `templates/`: HTML template files for different views
  - `chatDetail.html`: Chat detail page template
  - `chatList.html`: Chat list page template
  - `index.html`: Main application template
  - Additional templates for modals, tutorials, and other views

#### Styles and Frameworks
- `css/`: Stylesheets
  - `qqemoji-origin.css`
  - `qqemoji.css`
  - `style.css`
- `framework/`: Third-party libraries and frameworks
  - `angularjs-1.6.1/`: AngularJS library
  - `bootstrap-3.3.7/`: Bootstrap CSS and JavaScript
  - `jquery-3.1.1.min.js`: jQuery library
  - `layer/`: UI component library
  - `ui-bootstrap-tpls.js`: UI Bootstrap templates

#### Resources
- `resources/`: Static resources
  - `qqemoji.json`: Emoji configuration
  - `qqemoji.png`: Emoji sprite image
  - Default profile images

#### Images
- `imgs/`: Image assets
  - `face/`: Emoji face images
  - `icon/`: Application icons
  - `tutorial/`: Tutorial images

### Configuration and Build
- `Gruntfile.js`: Build configuration
- `build.sh`: Build script
- `builder.js`: Custom build tools
- `package.json`: NPM package configuration

### Root Directory
- `LICENSE`: Project licensing information
- `README.md`: Project documentation

### Testing
- `test/`: Contains test-related files and resources

This project structure supports a modular, AngularJS-based web application with clear separation of concerns between JavaScript logic, templates, styles, and resources.

## Additional Notes

### Project Maturity and Community Status
This project has been in development since 2020 and has gained significant community interest, with nearly 600 stars and 100 forks on GitHub. However, the project is currently in a maintenance state, with the original author acknowledging limitations and potential areas for improvement.

### Known Limitations
- Limited platform support (currently MacOS and iOS-focused)
- Incomplete message type coverage
- Potential complexity for new users

### Performance Considerations
- The application is resource-intensive, requiring specific setup with Node.js and NW.js
- Works best with carefully prepared WeChat backup data

### Future Development
The project welcomes community contributions, particularly pull requests that address existing limitations. While active development is paused, there's potential for future enhancements through community collaboration.

### Troubleshooting
- Always verify software and dependency versions compatibility
- Check application logs for specific error details
- Consult GitHub issues for known problems and potential solutions

### Data Privacy and Security
When exporting chat records:
- Ensure you have permission to access and export chat data
- Be mindful of personal information when handling exported conversations
- Use exported data responsibly and in compliance with privacy regulations

## Contributing

We welcome and appreciate contributions from the community! This project aims to improve the WeChat chat record exporter, and your help can make a significant difference.

### How to Contribute

1. **Fork the Repository**
   - Create a fork of the project on GitHub
   - Clone your forked repository locally

2. **Create a Branch**
   - Create a new branch for your feature or bug fix
   - Use a clear and descriptive branch name

3. **Making Changes**
   - Ensure your code follows the existing project structure
   - Test your changes thoroughly
   - Keep changes focused and atomic

### Contribution Guidelines

#### Code Considerations
- The project is built using AngularJS and Node.js
- Maintain consistency with the existing code style
- Add comments to explain complex logic
- Ensure cross-platform compatibility, especially for macOS

#### Reporting Issues
- Check existing issues before creating a new one
- Provide detailed information about the problem
- Include:
  - Environment details
  - Steps to reproduce
  - Expected vs. actual behavior
  - Relevant logs or error messages

#### Pull Request Process
- Provide a clear description of your changes
- Include the purpose and context of the modification
- Reference any related issues
- Ensure all tests pass
- Be prepared to discuss and refine your contribution

### Areas of Improvement
The project maintainer has highlighted several potential areas for contribution:
- Windows and Android system support
- Improve message type coverage
- Enhance user-friendliness
- Implement additional export formats

### Code of Conduct
- Be respectful and constructive
- Help create an inclusive environment
- Collaborate and provide constructive feedback

**Note**: While issue responses might be limited, pull requests will be reviewed promptly.

## License

This project is licensed under the GNU General Public License (GPL) version 3. The full license text is available in the [LICENSE](LICENSE) file.

### Key Licensing Terms
- You are free to use, modify, and distribute this software
- Any modifications must be shared under the same GPL-3.0 license
- There is no warranty provided with this software
- Commercial use is permitted, but any derived works must also be open-sourced

#### Permissions
- Commercial use
- Modification
- Distribution
- Patent use
- Private use

#### Limitations
- Trademark use
- Liability
- Warranty

For complete details, please review the full [LICENSE](LICENSE) file or visit the [GNU General Public License website](https://www.gnu.org/licenses/gpl-3.0.en.html).