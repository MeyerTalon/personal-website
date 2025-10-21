import React from 'react';

/**
 * Resume component
 * Provides options to view or download the resume
 * Includes both view (opens in new tab) and download functionality
 */
function Resume() {
    // Replace with your actual resume file path
    // For local development, place your resume.pdf in the public folder
    const resumePath = '/resume.pdf';

    /**
     * Opens resume in a new browser tab
     */
    const handleView = () => {
        window.open(resumePath, '_blank', 'noopener,noreferrer');
    };

    /**
     * Triggers download of the resume file
     */
    const handleDownload = () => {
        // Create a temporary link element to trigger download
        const link = document.createElement('a');
        link.href = resumePath;
        link.download = 'YourName_Resume.pdf'; // Customize filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="resume-section">
            <h1>Resume</h1>
            <p>
                View my professional experience, education, and skills, or download
                a copy for your records.
            </p>

            <div className="resume-actions">
                <button
                    className="btn btn-primary"
                    onClick={handleView}
                >
                    View Resume
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={handleDownload}
                >
                    Download PDF
                </button>
            </div>
        </section>
    );
}

export default Resume;