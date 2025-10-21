import React from 'react';

/**
 * Navigation component
 * Displays the top navigation bar with links to different sections
 *
 * @param {string} currentView - The currently active view
 * @param {function} setCurrentView - Function to update the current view
 */
function Navigation({ currentView, setCurrentView }) {
    return (
        <nav className="navigation">
            <div className="nav-container">
                <div className="logo">Your Name</div>
                <ul className="nav-links">
                    <li>
                        <button
                            className={currentView === 'home' ? 'active' : ''}
                            onClick={() => setCurrentView('home')}
                        >
                            Home
                        </button>
                    </li>
                    <li>
                        <button
                            className={currentView === 'projects' ? 'active' : ''}
                            onClick={() => setCurrentView('projects')}
                        >
                            Projects
                        </button>
                    </li>
                    <li>
                        <button
                            className={currentView === 'resume' ? 'active' : ''}
                            onClick={() => setCurrentView('resume')}
                        >
                            Resume
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navigation;