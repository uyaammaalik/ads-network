import React, { useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { auth, db, storage } from '../firebaseConfig'
import { Timestamp, addDoc, collection, doc, setDoc } from 'firebase/firestore'

function Sell() {

    const categories = ['Laptop', 'Phone', 'Dektop', 'Accessories']
    const locations = ['Nintavur', 'Karaitivu', 'Ampara', 'Batticaloa', 'Kalmunai']

    const [values, setValues] = useState({
        images: [],
        title: '',
        category: '',
        price: '',
        location: '',
        contact: '',
        description: '',
        error: '',
        loading: false
    })

    const { images, title, category, price, location, contact, description, error, loading } = values

    const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value })

    const handleSubmit = async e => {
        e.preventDefault()

        setValues({ ...values, error: " ", loading: true })

        try {
            let imgs = []
            //loop through images
            if (images.length) {

                for (let image of images) {
                    const imgref = ref(storage, `ads/${Date.now()}-${image.name}`)
                    const result = await uploadBytes(imgref, image)
                    const fileUrl = await getDownloadURL(ref(storage, result.ref.fullPath))
                    imgs.push({ url: fileUrl, path: result.ref.fullPath })
                }
            }
            //add data into firestore
            const result = await addDoc(collection(db, 'ads'), {
                images: imgs || [],
                title,
                category,
                price,
                location,
                contact,
                description,
                isSold: false,
                publishedAt: Timestamp.fromDate(new Date()),
                postedBy: auth.currentUser.uid
            })

            await setDoc(doc(db, 'favorites', result.id), {
                users: []
            })

            setValues({ images: [], title: '', category: '', price: '', location: '', contact: '', description: '', loading: false })
        } catch (error) {
            setValues({ ...values, error: error.message, loading: false })
        }
    }



    return (
        <div>
            <form className=" box-border border-2 lg:px-8 lg:py-8 w-full lg:w-100 
            rounded-lg md:w-2/6 lg:w-2/6 mx-auto mt-5 flex flex-col mt-8 drop-shadow-lg" onSubmit={handleSubmit}>
                <h2 className="text-lg lg:text-4xl semibold font-mono mx-auto">
                    Create an Add
                </h2>
                <label htmlFor='image' className='w-42 cursor-pointer bg-gray-600 text-white rounded-md mx-auto mt-5 py-1 px-3' style={{ display: "inline-flex" }}>
                    <FaCloudUploadAlt size={30} className='mx-auto' /> &#160; Upload Photo
                    <input type='file' id='image' accept='image/*'
                        style={{ display: "none" }} multiple
                        onChange={(e) => setValues({ ...values, images: e.target.files })} />
                </label>
                <div>
                    <label className='mt-3'> Title: &#160;</label><br />
                    <input type="text" name="title"
                        className="rounded-md mt-2 bg-gray-100 w-11/12 lg:w-100 px-3 py-1 lg:px-6 lg:py-3 mx-auto"
                        placeholder="Title" value={title} onChange={handleChange} />
                </div>
                <div>
                    <label className='mt-3'> Catogory: &#160;</label><br />
                    <select name='category' id='' onChange={handleChange} className="lg:mx-auto rounded-md mt-3 bg-gray-100 w-11/12 lg:w-100 px-3 py-1 lg:px-6 lg:py-3 ">
                        <option>Select Category</option>
                        {categories.map((category) =>
                            <option value={category} key={category}>{category}</option>
                        )}
                    </select>

                </div>
                <div>
                    <label className='mt-3'> Price: &#160;</label><br />
                    <input type="number" name="price" value={price} onChange={handleChange}
                        className="rounded-md mt-2 bg-gray-100 w-11/12 lg:w-100 px-3 py-1 lg:px-6 lg:py-3 mx-auto" />
                </div>
                <div>
                    <label className='mt-3'> Location: &#160;</label><br />
                    <select name='location' id='' onChange={handleChange} className="lg:mx-auto rounded-md mt-3 bg-gray-100 w-11/12 lg:w-100 px-3 py-1 lg:px-6 lg:py-3 ">
                        <option>Select Location</option>
                        {locations.map((location) =>
                            <option value={location} key={location}>{location}</option>
                        )}
                    </select>

                </div>
                <div>
                    <label className='mt-3'> Contact: &#160;</label><br />
                    <input type="text" name="contact" value={contact} onChange={handleChange}
                        className="rounded-md mt-2 bg-gray-100 w-11/12 lg:w-100 px-3 py-1 lg:px-6 lg:py-3 mx-auto"
                        placeholder="Contact" />
                </div>
                <div>
                    <label className='mt-3'> Description: &#160;</label><br />
                    <textarea name="description" cols={30} rows={3} value={description} onChange={handleChange}
                        className="rounded-md mt-2 bg-gray-100 w-11/12 lg:w-100 px-3 py-1 lg:px-6 lg:py-3 mx-auto"
                        placeholder="Descrition" />
                </div>

                {error ? <p className='text-center text-danger'>{error}</p> : null}
                <div className="flex flex-row my-5 mx-auto">

                    <button disabled={loading}
                        className="border-y rounded-md w-40 border-slate-500 px-3 py-3 hover:shadow-lg hover:border-x">Add</button>
                    <input type="reset"
                        className="ml-5 border-y rounded-md border-slate-500 px-3 py-3 hover:shadow-lg hover:border-x"
                        value="Clear" />
                </div>


            </form>
        </div>
    )
}

export default Sell