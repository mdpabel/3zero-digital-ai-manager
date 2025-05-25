import { Loader2 } from 'lucide-react';
import React from 'react';

const NewUserLoading = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='flex flex-col items-center space-y-4'>
        <Loader2 className='w-8 h-8 text-blue-600 animate-spin' />
        <p className='text-muted-foreground text-sm'>
          Setting up your account...
        </p>
      </div>
    </div>
  );
};

export default NewUserLoading;
