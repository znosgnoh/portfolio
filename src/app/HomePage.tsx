'use client';

import React from 'react';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import { Hero, About, Jobs, Featured, Projects, Contact } from '@/components/sections';
import { ContentItem } from '@/lib/content';

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

interface HomePageProps {
  jobs: ContentItem[];
  featuredProjects: ContentItem[];
  projects: ContentItem[];
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
