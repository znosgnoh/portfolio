'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import Hero from '@/components/sections/Hero';
import { ClientContentItem } from '@/lib/content';

const About = dynamic(() => import('@/components/sections/About'));
const Jobs = dynamic(() => import('@/components/sections/Jobs'));
const Featured = dynamic(() => import('@/components/sections/Featured'));
const Projects = dynamic(() => import('@/components/sections/Projects'));
const Contact = dynamic(() => import('@/components/sections/Contact'));

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

interface HomePageProps {
  jobs: ClientContentItem[];
  featuredProjects: ClientContentItem[];
  projects: ClientContentItem[];
}

const HomePage: React.FC<HomePageProps> = ({ jobs, featuredProjects, projects }) => {
  return (
    <Layout>
      <StyledMainContainer className="fillHeight">
        <Hero />
        <About />
        <Jobs jobs={jobs} />
        <Featured projects={featuredProjects} />
        <Projects projects={projects} />
        <Contact />
      </StyledMainContainer>
    </Layout>
  );
};

export default HomePage;
