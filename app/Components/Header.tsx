"use client"

import Image from 'next/image';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import Avatar from 'react-avatar';
import { useBoardStore } from '@/store/BoardStore';

const Header = () => {

  const [searchString, setSearchString] = useBoardStore((state) => [state.searchString, state.setSearchString]);

  return (
    <header className='relative'>
      <div className='absolute top-0 left-0 w-full h-screen z-[-1] bg-gradient-to-b from-purple-400 to-transparent'></div>
      <div className='flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl'>
        <Image
          src="https://links.papareact.com/c2cdd5"
          alt="Trello Logo"
          width={300}
          height={100}
          className='w-44 md:w-56 pb-10 md:pb-0 object-contain'
        />
        <div className='flex w-full items-center justify-end space-x-5 flex-1 py-2'>
          <form className='flex items-center justify-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial'>
            <MagnifyingGlassIcon className='h-6 w-6 text-gray-400' />
            <input value={searchString} onChange={(e) => setSearchString(e.target.value)} type="text" placeholder='Search' className='flex-1 outline-none p-2' />
            <button type="submit" hidden>Search</button>
          </form>
          <Avatar name="Pratik Valvi" round size='50' color='#0055D1' />
        </div>
      </div>
    </header>
  )
}

export default Header