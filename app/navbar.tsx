'use client';

import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import AvatarImage from './avatar.png';

const navigation = [
  { name: 'Email Purge Assistant', href: '/' },
  { name: "FAQ", href: '/faq'}
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <svg id="sw-js-blob-svg" width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs> 
                        <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
                            <stop id="stop1" stopColor="rgba(232.431, 76.449, 2.625, 1)" offset="0%"></stop>
                            <stop id="stop2" stopColor="rgba(60.317, 31, 251, 1)" offset="100%"></stop>
                        </linearGradient>
                    </defs>
                    <path fill="url(#sw-gradient)" d="M11.2,-18.7C15,-17.2,18.9,-15.2,22.2,-12C25.4,-8.8,28.1,-4.4,30.8,1.6C33.6,7.6,36.5,15.2,33.7,19.3C31,23.3,22.6,24,16,23.2C9.5,22.4,4.7,20.3,-0.2,20.5C-5,20.8,-10.1,23.5,-16.6,24.2C-23.1,25,-31,23.7,-33.7,19.4C-36.4,15,-33.8,7.5,-29.6,2.4C-25.5,-2.7,-19.8,-5.4,-16.7,-9C-13.6,-12.6,-13,-17.1,-10.7,-19.4C-8.3,-21.7,-4.1,-21.8,-0.2,-21.5C3.7,-21.1,7.4,-20.2,11.2,-18.7Z" width="100%" height="100%" transform="translate(50 50)" strokeWidth="0" stroke="url(#sw-gradient)"></path>
                  </svg>
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? 'border-slate-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                      )}
                      aria-current={pathname === item.href ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={user?.image || AvatarImage}
                        height={32}
                        width={32}
                        alt={`${user?.name || 'placeholder'} avatar`}
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {user ? (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'flex w-full px-4 py-2 text-sm text-gray-700'
                              )}
                              onClick={() => signOut()}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      ) : (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'flex w-full px-4 py-2 text-sm text-gray-700'
                              )}
                              onClick={() => signIn('google')}
                            >

                                  <div className="gsi-material-button-icon" style={{width: "24px", marginRight: "10px"}}>
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{display:"block"}}>
                                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                      <path fill="none" d="M0 0h48v48H0z"></path>
                                    </svg>
                                  </div>
                              Sign in with Google
                            </button>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-slate-50 border-slate-500 text-slate-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              {user ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={user.image}
                        height={32}
                        width={32}
                        alt={`${user.name} avatar`}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={() => signOut()}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => signIn('google')}
                    className="flex w-full px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                                  <div className="gsi-material-button-icon" style={{width: "24px", marginRight: "10px"}}>
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{display:"block"}}>
                                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                      <path fill="none" d="M0 0h48v48H0z"></path>
                                    </svg>
                                  </div>
                              Sign in with Google
                  </button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
