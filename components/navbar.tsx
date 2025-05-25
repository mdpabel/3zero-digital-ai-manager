'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserButton, SignedIn } from '@clerk/nextjs';
import logo from '@/public/logo-dark.png';

export default function Navbar() {
  return (
    <nav className='flex justify-between items-center shadow-sm px-6 py-4 w-full'>
      {/* Logo and brand */}

      <div className='flex items-center space-x-2'>
        <Link href='/dashboard'>
          <Image
            src={logo}
            alt='3 Zero Digital Logo'
            width={100}
            height={100}
          />
        </Link>
      </div>
      <SignedIn>
        {/* Navigation links */}
        <div className='flex space-x-6 text-sm'>
          <Link href='/dashboard'>Dashboard</Link>
          <Link href='/logs'>Logs</Link>
          <Link href='/employees'>Employees</Link>
        </div>
      </SignedIn>
      {/* User menu */}
      <div className='hidden md:block'>
        <UserButton afterSignOutUrl='/' />
      </div>
    </nav>
  );
}
