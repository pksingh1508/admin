// Types for database tables
export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  category_id: string | null;
  author_id: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPostWithRelations = BlogPost & {
  category?: BlogCategory | null;
  tags?: BlogTag[];
};

// Types for creating/updating records
export type CreateBlogPostInput = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string | null;
  category_id?: string | null;
  is_published?: boolean;
  published_at?: string | null;
  tags?: string[]; // Array of tag names
};

export type UpdateBlogPostInput = Partial<CreateBlogPostInput> & {
  id: string;
  is_published?: boolean;
};
