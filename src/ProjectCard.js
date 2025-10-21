import React from 'react';

/**
 * ProjectCard component
 * Displays an individual project with image, title, description, and tags
 * Clicking the card opens the project link in a new tab
 *
 * @param {object} project - Project data containing title, description, tags, link, and image
 */
function ProjectCard({ project }) {
    const handleClick = () => {
        // Open project link in new tab
        window.open(project.link, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="project-card" onClick={handleClick}>
            {/* Project image or placeholder */}
            <div className="project-image">
                {project.image ? (
                    <img src={project.image} alt={project.title} />
                ) : (
                    // Placeholder gradient if no image provided
                    <span>{project.title}</span>
                )}
            </div>

            {/* Project details */}
            <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                {/* Technology tags */}
                <div className="project-tags">
                    {project.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;