'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfileViewPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className='flex w-full flex-col p-4'>
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';

  return (
    <div className='flex w-full flex-col p-4 space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <UserAvatarProfile 
              user={user} 
              className='h-16 w-16'
            />
            <div>
              <h3 className='text-lg font-semibold'>{fullName}</h3>
              <p className='text-muted-foreground'>{user.email}</p>
            </div>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium'>Email</label>
              <p className='text-sm text-muted-foreground'>{user.email}</p>
            </div>
            <div>
              <label className='text-sm font-medium'>User ID</label>
              <p className='text-sm text-muted-foreground font-mono'>{user.id}</p>
            </div>
            <div>
              <label className='text-sm font-medium'>Account Created</label>
              <p className='text-sm text-muted-foreground'>
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium'>Last Sign In</label>
              <p className='text-sm text-muted-foreground'>
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}