import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebaseConfig'
import { signOut } from 'firebase/auth'

const Navbar = () => {

    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSignout = async () => {
        // update user doc
        await updateDoc(doc(db, 'users', user.uid), {
            inOnline: false,
        })
        // logout 
        await signOut(auth)
        //navigate to login
        navigate('/auth/login')
    }
    return (
        <div>
            <nav className="border-b border-gray-800">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-20 py-6">
                    <ul className="flex flex-col md:flex-row items-center">
                        <li>
                            <Link to="/">MovieApp</Link>
                        </li>
                    </ul>
                    <ul className='flex flex-col md:flex-row items-center'>
                        {user ? (<>
                            <li className="md:ml-16 mt-3 md:mt-0">
                                <Link to={`/user/profile/${user.uid}`} className="hover:text-gray-300">
                                    Profile
                                </Link>
                            </li>
                            <li className="md:ml-16 mt-3 md:mt-0">
                                <Link to={`/sell`} className="hover:text-gray-300">
                                    Sell
                                </Link>
                            </li>
                            <li className="md:ml-16 mt-3 md:mt-0">
                                <Link onClick={handleSignout} className="hover:text-gray-300">
                                    Logout
                                </Link>
                            </li>

                        </>) : (<>
                            <li className="md:ml-16 mt-3 md:mt-0">
                                <Link to="/auth/register" className="hover:text-gray-300">
                                    Register
                                </Link>
                            </li>
                            <li className="md:ml-6 mt-3 md:mt-0">
                                <Link to="/auth/login" className="hover:text-gray-300">
                                    Login
                                </Link>
                            </li>
                        </>)}

                    </ul>
                </div>
            </nav >
        </div >

    )
}

export default Navbar