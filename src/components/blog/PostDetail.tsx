'use client';

import { Link } from '@/navigation';
import { Post } from '@/types';
import { Chip } from '@nextui-org/react';
import { format } from 'date-fns';
import Image from 'next/image';
import { FC, PropsWithChildren, memo } from 'react';
import CategoryChip from '../CategoryChip';
import { MarkdownViewer } from '../Markdown';

type PostDetailProps = Omit<Post, 'id' | 'preview_image_url' | 'tags'> & {
  tags: string[];
  imageUrl: string | null;
};

const PostDetail: FC<PropsWithChildren<PostDetailProps>> = ({
  children,
  title,
  category,
  content,
  tags,
  imageUrl,
  created_at,
  status,
}) => (
  <div className="container flex flex-col gap-8 pb-24 pt-16">
    <div className="flex items-center justify-between">
      <h1 className="text-4xl font-bold">
        {status === 'DRAFT' && '[DRAFT] '}
        {title}
      </h1>
      {children}
    </div>
    <div className="flex flex-row items-center gap-2">
      <CategoryChip category={category} />
      {tags.map((tag) => (
        <Link href={`/tags/${tag}`} key={tag}>
          <Chip>{tag}</Chip>
        </Link>
      ))}
      <div className="text-sm text-gray-500">
        {format(new Date(created_at), 'yyyy년 M월 d일 HH:mm')}
      </div>
    </div>
    {imageUrl && (
      <Image
        src={imageUrl}
        width={0}
        height={0}
        sizes="100vw"
        alt={title}
        className="h-auto w-full max-w-[600px]"
        priority
      />
    )}
    <MarkdownViewer source={content} className="min-w-full" />
  </div>
);

export default memo(PostDetail);