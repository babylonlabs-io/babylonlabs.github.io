import React from 'react';
import Link from '@docusaurus/Link';

interface FeaturedBlogPost {
  title: string;
  image: string;
  link: string;
  readTime: number;
}

const blogPosts: FeaturedBlogPost[] = [
  {
    title: "Bitcoin Staking 101: Part 3 - Babylon's Bitcoin Staking Contract",
    image: "/img/blog/05-26-babylon-s-bitcoin-staking-contract/img.png",
    link: "https://babylonlabs.io/blog/babylon-s-bitcoin-staking-contract",
    readTime: 14
  },
  {
    title: "Bitcoin Staking 101: Part 2 - Technical Preliminaries of Bitcoin Staking",
    image: "/img/blog/05-25-technical-preliminaries-of-bitcoin-staking/img.png",
    link: "https://babylonlabs.io/blog/technical-preliminaries-of-bitcoin-staking",
    readTime: 12
  },
  {
    title: "Bitcoin Staking 101: Part 1 - What is Bitcoin Staking?",
    image: "/img/blog/05-24-what-is-bitcoin-staking/img.png",
    link: "https://babylonlabs.io/blog/what-is-bitcoin-staking",
    readTime: 5
  }
];

function FeaturedBlogPost({ title, image, link, readTime }: FeaturedBlogPost) {
  const content = (
    <>
      <img src={image} className="blog-image" alt={title} />
      <p className="text-md m-3">{title}</p>
      <span className="text-md mx-3 my-3">{readTime} min read</span>
    </>
  );

  return (
    <div className="blog-post pb-4">
      <Link to={link} className="blog-link">
        {content}
      </Link>
    </div>
  );
}

const BlogSection: React.FC = () => {
  return (
    <section className="blog-section">
      <div className="blog-container">
        <div className="title-overlay">
          <h2 className="title">Want to know more?</h2>
          <Link to="/blog" className="view-all">
            ALL Blogs →
          </Link>
        </div>

        <div className="blog-posts">
          {blogPosts.map((post) => (
            <FeaturedBlogPost 
              key={post.link} 
              {...post} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection; 