import React from 'react';
import './styles/app.css';
import ExampleComponent from './components/ExampleComponent';

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Welcome to Infinite Loop Gadgets</h1>
            <ExampleComponent />
        </div>
    );
};

export default App;