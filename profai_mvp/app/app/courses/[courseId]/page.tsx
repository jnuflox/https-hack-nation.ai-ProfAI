import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CourseDetailPage } from './course-detail';

interface Props {
  params: { courseId: string };
}

export default async function CourseDetail({ params }: Props) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }
  
  return <CourseDetailPage courseId={params.courseId} />;
}
