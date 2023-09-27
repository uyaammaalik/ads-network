import { doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db, storage, auth } from '../../firebaseConfig'
import { FaCloudUploadAlt, FaUserAlt } from 'react-icons/fa'
import { IoPersonRemove } from 'react-icons/io5'
import moment from 'moment'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const monthAndDate = (date) => `${moment(date).format("MMMM").slice(0, 3)} ${moment(date).format("YYYY")}`

function Profile() {

    const { id } = useParams()
    const [user, setUser] = useState()
    const [img, setImg] = useState("")

    const getUser = async () => {
        const docSnap = await getDoc(doc(db, 'users', id))

        if (docSnap.exists()) {
            setUser(docSnap.data())
        }
    }

    const uploadImage = async () => {
        //create image reference
        const imgref = ref(storage, `profile/${Date.now()} - ${img.name}`)

        // //check whether image already exist than delete the image
        if (user.photoUrl) {
            deleteObject(ref(storage, user.photoPath))
            updateDoc(doc(db, 'users', auth.currentUser.uid), {
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

    useEffect(() => {
        getUser()
        if (img) {
            uploadImage()
        }
    }, [img])

    const deletePhoto = async () => {
        const confirm = window.confirm("Delete photo permenantly?")
        if (confirm) {
            deleteObject(ref(storage, user.photoPath))
            updateDoc(doc(db, 'users', auth.currentUser.uid), {
                photoUrl: '',
                photoPath: ''
            })
        }
    }

    console.log(img)
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
                    <h3>{user.name}</h3>
                    <hr />
                </div>
            </div>
        </div >
    ) : null
}

export default Profile