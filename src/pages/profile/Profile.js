import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db, storage, auth } from '../../firebaseConfig'
import { FaCloudUploadAlt, FaUserAlt } from 'react-icons/fa'
import { IoPersonRemove } from 'react-icons/io5'
import moment from 'moment'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import AdCard from '../../components/AdCard'

const monthAndDate = (date) => `${moment(date).format("MMMM").slice(0, 3)} ${moment(date).format("YYYY")}`

function Profile() {

    const { id } = useParams()
    const [user, setUser] = useState()
    const [img, setImg] = useState("")
    const [ads, setAds] = useState([])

    const getUser = async () => {
        const docSnap = await getDoc(doc(db, 'users', id))

        if (docSnap.exists()) {
            setUser(docSnap.data())
        }
    }

    const uploadImage = async () => {
        //create image reference
        const imgref = ref(storage, `profile/${Date.now()}-${img.name}`)

        //check whether image already exist than delete the image
        if (user.photoUrl) {
            await deleteObject(ref(storage, user.photoPath))
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                photoUrl: '',
                photoPath: ''
            })
        }

        //upload image
        const result = await uploadBytes(imgref, img)

        //get download url
        const url = await getDownloadURL(ref(storage, result.ref.fullPath))

        //update user doc
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
            photoUrl: url,
            photoPath: result.ref.fullPath,
        })
        setImg("")
    }

    const getAds = async () => {
        //Create collection reference
        const adsRef = collection(db, 'ads')

        //Execute query
        const q = query(adsRef, where('postedBy', '==', id), orderBy('publishedAt', 'desc'))

        //Get data from Firestore
        let ads = []
        const docs = await getDocs(q)
        docs.forEach((doc) => {
            ads.push({ ...doc.data(), id: doc.id })
        })

        setAds(ads)
    }

    useEffect(() => {
        getUser()
        if (img) {
            uploadImage()
        }
        getAds()
    }, [img])

    console.log(ads)

    const deletePhoto = async () => {
        const confirm = window.confirm("Delete photo permenantly?")
        if (confirm) {
            await deleteObject(ref(storage, user.photoPath))
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                photoUrl: '',
                photoPath: ''
            })
        }
    }

    return user ? (
        <div>
            <div className="container mx-auto mt-5 row">
                <div className="text-center col-sm-2 col-md-3">

                    <div>
                        {user.photoUrl ? (<img src={user.photoUrl} alt={user.name} className="container"
                            style={{ width: "100px", height: "100px", borderRadius: "50%" }} />) : (<FaUserAlt size={50} className='container' />)}

                    </div>

                    <label className="dropdown my-3 text-center">
                        <button className="btn btn-sm btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Edit
                        </button>

                        <ul className="dropdown-menu">
                            <li><label className="dropdown-item" htmlFor='photo' style={{ display: "inline-flex" }}>
                                <FaCloudUploadAlt size={30} /> &#160; Upload Photo
                                <input type='file' id='photo' accept='image/*' style={{ display: "none" }}
                                    onChange={(e) => setImg(e.target.files[0])} />
                            </label>

                            </li>
                            {user.photoUrl ? (<li><button className="dropdown-item" style={{ display: "inline-flex" }} onClick={deletePhoto}>
                                <IoPersonRemove size={30} /> &#160; Remove </button></li>) : (null)}

                        </ul>
                    </label>
                    <p>Member since {monthAndDate(user.createdAt.toDate())}</p>
                </div>
                <div className='col-sm-10 col-md-9'>
                    <h1 className='text-2xl'>{user.name}</h1>
                    <hr />
                    {ads.length ? (<h4 className='mt-2 text-xl'>Published Ads</h4>) : (<h4 className='mt-2 text-xl'>There are no ads published yet</h4>)}

                    {ads?.map(ad => <div className='grid grid-cols-4 gap-4' key={ad.id}>
                        <AdCard ad={ad} />
                    </div>)}
                </div>
            </div>
        </div >
    ) : null
}

export default Profile