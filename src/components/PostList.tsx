'use client';

import { cn } from '@/utils/style';
import { createClient } from '@/utils/supabase/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { InView } from 'react-intersection-observer';
import PostCard from './PostCard';

const supabase = createClient();

type PostListProps = {
  category?: string;
  tag?: string;
  className?: string;
  isAdmin?: boolean;
};

const PostList: FC<PostListProps> = ({ isAdmin, category, tag, className }) => {
  const {
    data: postPages,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }) => {
      let request = supabase.from('Post').select('*');

      if (category) request = request.eq('category', category);
      if (tag) request = request.like('tags', `%${tag}%`);
      if (!isAdmin) request = request.eq('status', 'PUBLISHED');

      const { data } = await request
        .order('created_at', { ascending: false })
        .range(pageParam, pageParam + 9);

      if (!data)
        return {
          posts: [],
          nextPage: null,
        };
      return {
        posts: data,
        nextPage: data.length === 10 ? pageParam + 10 : null,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  return (
    <div
      className={cn('flex flex-col items-center gap-8 @container', className)}
    >
      <h1 className={cn('text-2xl font-medium', !category && !tag && 'hidden')}>
        {category ? category : `#${tag}`}
      </h1>
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 @xl:grid-cols-2 @4xl:grid-cols-3">
        {postPages?.pages
          .flatMap((page) => page.posts)
          .map(({ title, status, ...post }) => (
            <PostCard
              key={post.id}
              title={status === 'DRAFT' ? `[DRAFT] ${title}` : title}
              {...post}
            />
          ))}
        <InView
          onChange={(inView) => inView && hasNextPage && fetchNextPage()}
        />
      </div>
    </div>
  );
};

export default PostList;
