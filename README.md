# Infinite Loop Gadgets

## Overview
Infinite Loop Gadgets is a React application built with TypeScript. This project serves as a template for creating scalable and maintainable web applications using modern web technologies.

## Features
- React with TypeScript for type safety
- Custom hooks for reusable logic
- Controllers for managing application state
- Unit tests to ensure code quality
- Environment configuration with `.env` file
- GitHub Actions for automated versioning 

## Project Structure
```
Infinite-Loop-Gadgets
├── public
│   └── index.html
├── src
│   ├── index.tsx
│   ├── App.tsx
│   ├── components
│   │   └── ExampleComponent.tsx
│   ├── controllers
│   │   └── HomeController.ts
│   ├── hooks
│   │   └── useExample.ts
│   ├── styles
│   │   └── app.css
│   ├── types
│   │   └── index.d.ts
│   └── __tests__
│       └── App.test.tsx
├── .github
│   └── workflows
│       └── release.yml
├── .gitignore
├── .env
├── package.json
├── tsconfig.json
├── jest.config.ts
└── README.md
```

## Getting Started

### Prerequisites
- Node.js version 22.19.0 or higher
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd Infinite-Loop-Gadgets
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To start the application, run:
```
npm start
```
This will launch the application in your default web browser.

### Running Tests
To run the unit tests, use:
```
npm test
```

### Environment Variables
You can define environment variables in the `.env` file. Make sure to restart the application after making changes to this file.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.