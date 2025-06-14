import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants/assets';
import '../styles/Home.css';

const Home = () => {

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>EXPERIENCE THE EPITOME OF HOME COMFORT.</h1>
                    <p>
                        Our international brand specializes in property appraisal, sales, 
                        purchases, and investments. Trust us to deliver exceptional service 
                        and help you find your perfect real estate opportunity.
                    </p>
                    <Link to="/properties" className="cta-button">
                        Explore Properties
                        <span className="arrow-icon">↗</span>
                    </Link>
                </div>
                <div className="hero-image">
                    <img src={IMAGES.HERO_BG} alt="Luxury Home" />
                </div>
            </section>

            {/* About Section */}
            <section className="about">
                <div className="about-left">
                    <h2>About Us</h2>
                    <span><p>
                        We take great pride in ensuring the satisfaction of our customers. 
                        That's why we proudly guarantee the quality and reliability of our products.
                    </p></span>
                    <div className="about-icon">
                        <img src={IMAGES.PROPERTY1} alt="About Us" />
                    </div>
                </div>
                <div className="about-right">
                    <h2>WE'VE FOUND LUXURY HOMES FOR CLIENTS</h2>
                    <p>We take great pride in ensuring the satisfaction
                    of our customers, which is why we guarantee that 
                    the products we sell will bring happiness to each
                    and every customer. Our genuine care for customer
                    satisfaction is what sets us apart.</p>
                    
                    <div className="stats">
                        <div className="stat-item">
                            <h3>10<span>+</span></h3>
                            <p>Awards Gained</p>
                        </div>
                        <div className="stat-item">
                            <h3>20<span>+</span></h3>
                            <p>Years of Experience</p>
                        </div>
                        <div className="stat-item">
                            <h3>598<span>+</span></h3>
                            <p>Rented Home Stay</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dream House Section */}
            <section className="dream-house">
                <div className="dream-house-image">
                    <img src={IMAGES.PROPERTY2} alt="Dream House" />
                    <h2>DREAM HOUSE</h2>
                </div>
            </section>

            {/* Project Section */}
            <section className="project">
                <div className="project-left">
                    <h2>The Project</h2>
                </div>
                <div className="project-right">
                    <p>
                        Together, we can conquer challenges, utilize our strengths, 
                        and achieve remarkable success in this ambitious home project.
                    </p>
                </div>
                <div className="project-slider">
                    <img src={IMAGES.LUXURY_VILLA} alt="Project Home" />
                    <div className="slider-controls">
                        <button className="prev">←</button>
                        <button className="next">→</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home; 