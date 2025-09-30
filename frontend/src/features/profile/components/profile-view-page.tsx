'use client';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfileViewPage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className='flex w-full flex-col p-4'>
      <Card className='w-full border shadow-lg'>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6'>
            {/* Avatar bên trái - tỉ lệ 4 */}
            <div className='w-full md:w-1/3 flex justify-center items-center min-h-[200px] md:min-h-full'>
              <Avatar className='h-24 w-24 md:h-32 md:w-32'>
                <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                <AvatarFallback className='text-xl md:text-2xl'>
                  {session.user.name?.charAt(0) || session.user.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Thông tin bên phải - tỉ lệ 8 */}
            <div className='w-full md:w-2/3 space-y-4'>
              <div className='text-center md:text-left'>
                <h3 className='text-xl md:text-2xl font-semibold mb-1'>
                  {session.user.name || session.user.username}
                </h3>
                <p className='text-muted-foreground text-base md:text-lg'>{session.user.email}</p>
              </div>
              
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
                <div className='space-y-1 p-3 border rounded-lg bg-muted/30'>
                  <label className='text-sm font-medium text-muted-foreground'>Username</label>
                  <p className='text-sm font-medium'>{session.user.username}</p>
                </div>
                <div className='space-y-1 p-3 border rounded-lg bg-muted/30'>
                  <label className='text-sm font-medium text-muted-foreground'>Email</label>
                  <p className='text-sm font-medium'>{session.user.email}</p>
                </div>
                <div className='space-y-1 p-3 border rounded-lg bg-muted/30'>
                  <label className='text-sm font-medium text-muted-foreground'>User ID</label>
                  <p className='text-sm font-medium'>{session.user.id}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
