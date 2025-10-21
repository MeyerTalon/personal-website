import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Projects from './components/Projects';
import Resume from './components/Resume';

/**
 * Main App component
 * Manages navigation state and renders appropriate views
 */
function App() {
    const [currentView, setCurrentView] = useState('home');

    const renderView = () => {
        switch(currentView) {
            case 'home':
                return <Home />;
            case 'projects':
                return <Projects />;
            case 'resume':
                return <Resume />;
            default:
                return <Home />;
        }
    };

    return (
        <div className="App">
            <Navigation currentView={currentView} setCurrentView={setCurrentView} />
            <main className="main-content">
                {renderView()}
            </main>
            <footer className="footer">
                <p>© 2025 Your Name. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;