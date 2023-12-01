import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { options } from '../api/auth/[...nextauth]/options';
import Image from 'next/image';

const Nav = async () => {
 const session = await getServerSession(options);
 const menus = [
    {
        name: 'Dashboard',
        url:'/dashboard',
        icon: '/icon-dashboard.svg',
        access:['admin', 'user']
    },
    {
        name: 'Create User',
        url:'/dashboard/create-user',
        icon: '/icon-user.svg',
        access:['admin']
    },
 
    {
        name: 'Member',
        url:'/dashboard/member',
        icon: '/icon-member.svg',
        access:['admin', 'user']
    },
    ,
    {
        name: 'Settings',
        url:'/dashboard/settings',
        icon: '/icon-settings.svg',
        access:['admin']
    },
    
 ]
  return (

    <nav className='h-screen flex flex-col max-w-[300px] w-full bg-gray-600 p-4'>
        <div className='bg-white rounded p-4 font-bold'>Site Logo</div>
        <div className='flex flex-col gap-1 text-white h-full [&>a]:block [&>a]:py-2 border-t border-gray-500
        mt-4'>
            {/* <Link href={'/dashboard'}><span className='flex items-center'><span className='mr-2'><Image height={20} width={20} alt="dashboard" src='/icon-dashboard.svg'/></span> Dashboard</span></Link>
            <Link href={'/dashboard/create-user'}><span className='flex items-center'><span className='mr-2'><Image height={20} width={20} alt="dashboard" src='/icon-dashboard.svg'/></span> Create User</span></Link>
            <Link href={'/dashboard/client-member'}><span className='flex items-center'><span className='mr-2'><Image height={20} width={20} alt="dashboard" src='/icon-dashboard.svg'/></span> Guest Page</span></Link>
            <Link href={'/dashboard/member'}>Member</Link>
            <Link href={'/Public'}>Public</Link> */}

            {
                menus.map((menu,i)=>{
                    if(menu?.access.includes(session.user.role)){
                        return <Link href={menu?.url ?? ''} key={i}><span className='flex items-center'><span className='mr-2'><Image height={20} width={20} alt="dashboard" src={menu?.icon ?? ''}/></span> {menu?.name}</span></Link> 
                    }
                    return null;
                })
            }
            
            {
                session ? 
                <Link href={'/api/auth/signout?callbackUrl=/'}  className='mt-auto bg-red-500 px-4 rounded'>Logout</Link> : 
                <Link href={'/api/auth/signin'} className='mt-auto'>Login</Link>
            }
        </div>
    </nav>
   
  )
}

export default Nav