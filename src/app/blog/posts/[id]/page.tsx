import PostDetail from '@/components/PostDetail';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

type PostPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params: { id } }: PostPageProps) {
  const supabase = createClient(cookies());
  const { data } = await supabase.from('Post').select('*').eq('id', Number(id));

  if (!data || !data[0])
    return {
      title: '동훈의 블로그',
      description: '장동훈이 잘 살아가기 위해 정리하는 생각들',
    };

  const title = data[0].title;
  const description = data[0].content.slice(0, 100);

  return {
    metadataBase: new URL('https://blog.dhoonjang.io'),
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: '동훈의 블로그',
      images: [
        {
          url: `/api/og?title=${title}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: `/api/og?title=${title}`,
    },
  };
}

export async function generateStaticParams() {
  const supabase = createClient();
  const { data } = await supabase.from('Post').select('id');
  if (!data) return [];
  return data.map(({ id }) => ({ id: String(id) }));
}

const PostPage = async ({ params: { id } }: PostPageProps) => {
  const supabase = createClient(cookies());
  const { data } = await supabase.from('Post').select('*').eq('id', Number(id));

  if (!data || !data[0]) return notFound();

  const { title, category, tags, content, created_at, preview_image_url } =
    data[0];

  return (
    <PostDetail
      title={title}
      category={category}
      tags={JSON.parse(tags) as string[]}
      content={content}
      created_at={created_at}
      imageUrl={preview_image_url}
    />
  );
};

export default PostPage;