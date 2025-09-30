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
      <Card className='max-w-md mx-auto'>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <Avatar className='h-20 w-20'>
              <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
              <AvatarFallback className='text-lg'>
                {session.user.name?.charAt(0) || session.user.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className='text-lg font-semibold'>
                {session.user.name || session.user.username}
              </h3>
              <p className='text-muted-foreground'>{session.user.email}</p>
            </div>
          </div>
          
          <div className='space-y-2'>
            <div>
              <label className='text-sm font-medium'>Username</label>
              <p className='text-sm text-muted-foreground'>{session.user.username}</p>
            </div>
            <div>
              <label className='text-sm font-medium'>Email</label>
              <p className='text-sm text-muted-foreground'>{session.user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
