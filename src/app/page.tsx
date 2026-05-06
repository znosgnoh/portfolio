import { getJobs, getFeaturedProjects, getProjects } from '@/lib/content';
import HomePage from './HomePage';

export default async function Page() {
  const [jobs, featuredProjects, projects] = await Promise.all([
    getJobs(),
    getFeaturedProjects(),
    getProjects(),
  ]);

  return <HomePage jobs={jobs} featuredProjects={featuredProjects} projects={projects} />;
}
