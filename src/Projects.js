import React from 'react';
import ProjectCard from './ProjectCard';

/**
 * Projects component
 * Displays a grid of project cards
 * Each project is rendered using the ProjectCard component
 */
function Projects() {
    // Project data - Replace with your actual projects
    const projects = [
        {
            id: 1,
            title: "Neural Architecture Search Framework",
            description: "Automated framework for discovering optimal neural network architectures using reinforcement learning and evolutionary algorithms.",
            tags: ["Python", "PyTorch", "RL", "AutoML"],
            link: "https://github.com/yourusername/project1",
            image: null // Add image URL if available
        },
        {
            id: 2,
            title: "Real-time Object Detection System",
            description: "High-performance object detection system achieving 60+ FPS on edge devices using optimized YOLO architecture.",
            tags: ["Computer Vision", "TensorFlow", "C++", "CUDA"],
            link: "https://github.com/yourusername/project2",
            image: null
        },
        {
            id: 3,
            title: "Large-scale Text Classification",
            description: "Scalable NLP pipeline for multi-label text classification handling millions of documents with transformer-based models.",
            tags: ["NLP", "BERT", "Python", "Kubernetes"],
            link: "https://github.com/yourusername/project3",
            image: null
        },
        {
            id: 4,
            title: "Federated Learning Platform",
            description: "Privacy-preserving machine learning platform enabling collaborative model training across distributed datasets.",
            tags: ["Federated Learning", "Privacy", "PyTorch", "Docker"],
            link: "https://github.com/yourusername/project4",
            image: null
        },
        {
            id: 5,
            title: "ML Model Interpretability Tool",
            description: "Interactive visualization tool for understanding and debugging deep learning models using attention mechanisms and SHAP values.",
            tags: ["XAI", "React", "D3.js", "Python"],
            link: "https://github.com/yourusername/project5",
            image: null
        },
        {
            id: 6,
            title: "Time Series Forecasting Engine",
            description: "Production-ready forecasting engine combining statistical methods with deep learning for financial and IoT applications.",
            tags: ["Time Series", "LSTM", "Prophet", "AWS"],
            link: "https://github.com/yourusername/project6",
            image: null
        }
    ];

    return (
        <section className="projects-section">
            <h1>Projects</h1>
            <div className="projects-grid">
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
}

export default Projects;