# CodeFlow - JavaScript Visual Debugger

A sophisticated JavaScript debugging tool that provides real-time visualization of code execution with step-by-step analysis, variable inspection, and comprehensive error handling.

## **What Makes CodeFlow Unique?**

### **Custom JavaScript Engine**
- **Built from scratch** - No external debugging libraries used
- **Expression Evaluator** - Handles arithmetic, variables, objects, arrays, and strings
- **Execution Engine** - Step-by-step code parsing and execution
- **Error Detection** - Comprehensive error catching with line numbers

### **Advanced Features**
- **Real-time Variable Tracking** - Watch variables change as code executes
- **Interactive Debugging** - Step, run, pause, and reset execution
- **Console Output Visualization** - See console.log results in real-time
- **Error Panel** - Detailed error messages with execution context
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Professional UI** - Modern interface with Tailwind CSS

## **Technical Skills Demonstrated**

### **Frontend Development**
- **React 19** with latest hooks and patterns
- **TypeScript** for type safety and better code quality
- **Next.js 15** for modern full-stack development
- **Tailwind CSS** for professional, responsive styling
- **Monaco Editor** integration (VS Code editor)

### **Advanced JavaScript**
- **Expression Parser** - Custom implementation for evaluating JavaScript expressions
- **AST-like Processing** - Parsing and executing code step by step
- **Error Handling** - Comprehensive try-catch with meaningful error messages
- **State Management** - Complex state with React hooks

### **Software Engineering**
- **Component Architecture** - Clean, reusable React components
- **Code Organization** - Proper separation of concerns
- **Performance Optimization** - Efficient rendering and state updates
- **User Experience** - Intuitive interface with help system

## **Resume Value**

This project demonstrates:

### **Technical Excellence**
- **Complex Problem Solving** - Built a JavaScript engine from scratch
- **Advanced React Skills** - State management, component architecture
- **TypeScript Proficiency** - Type-safe development practices
- **Modern Development** - Latest frameworks and best practices

### **Engineering Practices**
- **Clean Code** - Well-organized, maintainable codebase
- **User Experience** - Professional UI with help system
- **Responsive Design** - Mobile-friendly interface
- **Performance** - Efficient rendering and updates

### **Key Talking Points for Interviews**
- "Built a JavaScript debugging engine with custom expression evaluator"
- "Implemented real-time code execution visualization with React 19"
- "Created responsive UI with modern TypeScript and Tailwind CSS"
- "Integrated Monaco Editor for professional code editing experience"

## **Getting Started**

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd code-visualizer
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Write Code** - Enter JavaScript code in the editor
2. **Execute** - Use the control buttons to run, step, or play your code
3. **Inspect** - Watch variables and console output update in real-time
4. **Debug** - Set breakpoints and use step execution to debug your code
5. **Export** - Save your work using the export functionality

### Supported JavaScript Features
- Variable declarations (`let`, `const`, `var`)
- Basic arithmetic operations (`+`, `-`, `*`, `/`)
- String literals (single and double quotes)
- Boolean literals (`true`, `false`)
- Array literals (`[1, 2, 3]`)
- Object literals (`{key: value}`)
- Console logging (`console.log()`)

## Controls

- **Run** - Execute code from the beginning
- **Step** - Execute one line at a time
- **Play** - Auto-execute with delay between steps
- **Pause** - Pause auto-execution
- **Continue** - Continue execution after breakpoint
- **Back** - Go back one execution step
- **Reset** - Clear execution state
- **Export** - Download code as file
- **Import** - Load code from file
- **Copy** - Copy code to clipboard

## Project Structure

```
code-visualizer/
  app/                  # Next.js app directory
    page.tsx           # Main application page
  components/          # React components
    Controls.tsx       # Control buttons
    Editor.tsx         # Code editor
    VariablePanel.tsx  # Variable display
    ConsolePanel.tsx   # Console output
    ErrorPanel.tsx     # Error display
  engine/             # Execution engine
    executor.ts        # Code execution logic
    evaluator.ts       # Expression evaluation
  types/              # TypeScript type definitions
  utils/              # Utility functions
    codeManager.ts     # Export/import functionality
```

## Testing

Run the test suite to verify functionality:

```bash
# Run evaluator tests
node test-fix.js

# Run manual tests
node test-executor.js
```

## Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically with zero configuration

### Manual Deployment

1. Build the application
```bash
npm run build
```

2. Start the production server
```bash
npm start
```

### Environment Variables

- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_VERSION` - Application version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code editing
- **React** - UI components

## Future Enhancements

- [ ] Support for functions and control flow
- [ ] Advanced debugging features
- [ ] Code sharing and collaboration
- [ ] Performance profiling
- [ ] Additional language support
