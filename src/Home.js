import React from 'react';

/**
 * Home component
 * Displays the landing page with introduction and bio
 */
function Home() {
    return (
        <section className="home-section">
            <h1>Hi, I'm [Your Name]</h1>
            <p className="subtitle">Software Engineer & Machine Learning Researcher</p>

            <div className="description">
                <p>
                    I'm a software engineer and machine learning researcher passionate about
                    building intelligent systems that solve real-world problems. With expertise
                    in deep learning, computer vision, and natural language processing, I bridge
                    the gap between cutting-edge research and practical applications.
                </p>

                <p>
                    My work focuses on developing scalable ML solutions and conducting research
                    in areas like neural architecture search, model optimization, and AI safety.
                    I believe in writing clean, maintainable code and creating systems that are
                    both powerful and interpretable.
                </p>

                <p>
                    When I'm not training models or writing code, you'll find me contributing
                    to open-source projects, writing technical blog posts, or exploring the
                    latest advancements in AI research.
                </p>
            </div>
        </section>
    );
}

export default Home;