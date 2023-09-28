import { QuerySnapshot, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import Moment from 'react-moment'
import { auth, db } from '../firebaseConfig'

const AdCard = ({ ad }) => {
    const adLink = `/${ad.category.toLowerCase()}/${ad.id}`
    const [users, setUsers] = useState([])

    useEffect(() => {
        const docRef = doc(db, 'favorites', ad.id)
        const unsub = onSnapshot(docRef, (QuerySnapshot) => setUsers(QuerySnapshot.data().users))
        return () => unsub()

    }, [])

    //function for users' favorite
    const toggleFavorite = async () => {
        //check whether the user already has favorite
        let isFav = users.includes(auth.currentUser.uid)

        //if user already has favorite remove from it else add the user to favorite
        await updateDoc(doc(db, 'favorites', ad.id), {
            users: isFav ? (users.filter((id) => id !== auth.currentUser.uid))
                : (users.concat(auth.currentUser.uid))
        })
    }

    // const toggleFavorite = async () => {
    //     const userUid = auth.currentUser.uid;
    //     const isFav = users.includes(userUid);

    //     const favoritesRef = doc(db, 'favorites', ad.id);
    //     let updatedUsers;

    //     if (isFav) {
    //         // User has already favorited the ad, so remove them
    //         updatedUsers = users.filter((id) => id !== userUid);
    //     } else {
    //         // User hasn't favorited the ad, so add them
    //         updatedUsers = [...users, userUid];
    //     }

    //     // Update the Firestore document with the new users array
    //     try {
    //         await updateDoc(favoritesRef, { users: updatedUsers });
    //     } catch (error) {
    //         console.error('Error toggling favorite:', error);
    //     }
    // };


    return (
        <div className=''>
            <div className='border-2 rounded-md mt-3'>
                <img className='' src={ad.images[0].url} title={ad.title} style={{ width: '100%', height: '200px' }} />
                <div className='flex flex-row justify-between mt-2 px-2'>
                    <small>{ad.category}</small>

                    {users?.includes(auth.currentUser?.uid) ? (<AiFillHeart size={30} className='cursor-pointer fill-red-500' onClick={toggleFavorite} />)
                        : (<AiOutlineHeart className='cursor-pointer' size={30} onClick={toggleFavorite} />)}

                </div>
                <div className='mt-1 px-2 text-xl'>{ad.title}</div>
                <div className='mt-1 px-2 '>{ad.location} - <Moment fromNow>{ad.publishedAt.toDate()}</Moment><br />
                    LKR. {Number(ad.price).toLocaleString()} </div>
            </div>
        </div>
    )
}

export default AdCard