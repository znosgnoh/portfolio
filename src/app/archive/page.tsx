import { getProjects, toClientContent } from '@/lib/content';
import ArchivePage from './ArchivePage';

export const metadata = {
  title: 'Archive | Nosgnoh',
  description: 'A list of all projects',
};

export default async function Archive() {
  const projects = await getProjects();

  return <ArchivePage projects={projects.map(toClientContent)} />;
}
