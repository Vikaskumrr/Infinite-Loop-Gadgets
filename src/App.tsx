import React from 'react';
import HomePage from './components/HomePage/HomePage';
import './styles/app.scss';

function App(): JSX.Element {
    return (
        <div className="app">
            <main className="content">
                <HomePage />
            </main>
        </div>
    );
}

export default App;