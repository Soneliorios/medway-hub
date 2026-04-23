export interface Project {
  id: string;
  name: string;
  description: string;
  embedUrl: string;
  thumbnail: string;
  category: string;
  specialtyColor: string;
  authMethod: string;
  isActive: boolean;
  isFeatured: boolean;
  responsibleName: string;
  teamName: string;
  createdAt: Date | string;
}
