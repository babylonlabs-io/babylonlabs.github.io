// components/homepage/BlogSection.js
import React from 'react';

const BlogSection = () => {
  return (
    <section className="blog-section">
      <div className="blog-container">
        <div className="title-overlay">
          <h2 className="title">Want to know more?</h2>
          <a href="/blog" className="view-all">
            ALL Blogs →
          </a>
        </div>

        <div className="blog-posts">
          <div className="blog-post first-post">
            <a href="/blog/2025/05/25/btc-staking-101/" className="blog-link">
              <img
                src="/img/blog/05-26-babylon-s-bitcoin-staking-contract/img.png"
                className="blog-image"
              />
              <p>
                Bitcoin Staking 101: Part 3 - Babylon's Bitcoin Staking Contract
              </p>
              <span>14 min read</span>
            </a>
          </div>

          <div className="blog-post">
            <a href="/blog/2025/05/25/technical-preliminaries-of-bitcoin-staking" className="blog-link">
              <img
                src="/img/blog/05-25-technical-preliminaries-of-bitcoin-staking/img.png"
                className="blog-image"
              />
              <p>
                Bitcoin Staking 101: Part 2 - Technical Preliminaries of Bitcoin Staking
              </p>
              <span>12 min read</span>
            </a>
          </div>

          <div className="blog-post">
            <a href="/blog/2025/05/24/what-is-bitcoin-staking" className="blog-link">
              <img
                src="/img/blog/05-24-what-is-bitcoin-staking/img.png"
                className="blog-image"
              />
              <p>
                Bitcoin Staking 101: Part 1 - What is Bitcoin Staking?
              </p>
              <span>5 min read</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
