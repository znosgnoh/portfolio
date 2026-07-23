import { getJobs, getFeaturedProjects, getProjects, toClientContent } from '@/lib/content';
import HomePage from './HomePage';

export default async function Page() {
  const [jobs, featuredProjects, projects] = await Promise.all([
    getJobs(),
    getFeaturedProjects(),
    getProjects(),
  ]);

  return (
    <HomePage
      jobs={jobs.map(toClientContent)}
      featuredProjects={featuredProjects.map(toClientContent)}
      projects={projects.map(toClientContent)}
    />
  );
}
