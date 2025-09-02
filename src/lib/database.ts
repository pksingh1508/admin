import { createClient } from '@supabase/supabase-js';
import { BlogCategory, BlogPost, BlogTag, CreateBlogPostInput, UpdateBlogPostInput } from '@/types/database.types';

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const db = {
  // Blog Posts
  async getBlogPostById(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*),
        blog_post_tags(
          tag:blog_tags(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      tags: data.blog_post_tags?.map((pt: any) => pt.tag) || [],
    } as BlogPost & { category: BlogCategory | null; tags: BlogTag[] };
  },

  async createBlogPost(post: CreateBlogPostInput, authorId: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        ...post,
        author_id: authorId,
        is_published: post.is_published || false,
        published_at: post.is_published ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  async getBlogPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*),
        blog_post_tags(
          tag:blog_tags(*)
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;

    // Transform the data to match our type
    return {
      ...data,
      tags: data.blog_post_tags.map((pt: any) => pt.tag),
    } as BlogPost & { category: BlogCategory | null; tags: BlogTag[] };
  },

  async updateBlogPost(id: string, updates: Partial<UpdateBlogPostInput>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...updates,
        ...(updates.is_published !== undefined && {
          published_at: updates.is_published ? new Date().toISOString() : null,
        }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BlogPost;
  },

  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as BlogCategory[];
  },

  // Tags
  async getOrCreateTags(tagNames: string[]) {
    if (tagNames.length === 0) return [];
    
    // First, get existing tags
    const { data: existingTags, error: fetchError } = await supabase
      .from('blog_tags')
      .select('*')
      .in('name', tagNames);

    if (fetchError) throw fetchError;

    // Find tags that don't exist yet
    const existingTagNames = new Set(existingTags?.map(tag => tag.name.toLowerCase()));
    const newTags = tagNames.filter(name => !existingTagNames.has(name.toLowerCase()));

    // Create new tags
    if (newTags.length > 0) {
      const { data: createdTags, error: createError } = await supabase
        .from('blog_tags')
        .insert(newTags.map(name => ({
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        })))
        .select();

      if (createError) throw createError;
      return [...(existingTags || []), ...(createdTags || [])] as BlogTag[];
    }

    return existingTags as BlogTag[] || [];
  },

  // File uploads (for ImageKit)
  async uploadFile(file: File, path: string) {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${path}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('blog-images') // Make sure this bucket exists in your Supabase storage
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('blog-images')
      .getPublicUrl(data.path);

    return publicUrl;
  },
};

export default db;
