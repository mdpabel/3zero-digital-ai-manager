import { SignInButton, SignUpButton, SignedOut } from '@clerk/nextjs';
import Image from 'next/image';
import logo from '@/public/logo-dark.png';
import { Button } from '@/components/ui/button';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  return (
    <div className='flex flex-col justify-center items-center px-4 h-full text-center'>
      <Image
        src={logo}
        alt='3 Zero Digital Logo'
        width={120}
        height={120}
        className='mb-4'
      />

      <div className='mx-auto max-w-3xl'>
        <h1 className='mb-2 font-bold text-3xl sm:text-5xl'>
          3Zero Digital AI Manager
        </h1>
        <p className='mb-6 text-lg'>
          This AI Manager tracks daily work inside the 3Zero team — analyzing
          logs, scoring progress, and identifying what actually drives business
          growth. One clear mission:{' '}
          <strong>0 Vulnerability, 0 Downtime, 0 Error</strong>.
        </p>
      </div>

      <div className='flex space-x-4'>
        <Button className='px-10 py-5' asChild>
          <SignInButton forceRedirectUrl='/dashboard' mode='modal'>
            Login
          </SignInButton>
        </Button>
        <Button
          className='px-10 py-5 border border-zinc-600'
          variant='outline'
          asChild>
          <SignUpButton forceRedirectUrl='/new-user' mode='modal'>
            Sign Up
          </SignUpButton>
        </Button>
      </div>
    </div>
  );
}
