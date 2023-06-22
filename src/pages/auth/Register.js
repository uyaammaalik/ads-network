import React, { useState } from 'react'
import { auth, db } from '../../firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Timestamp, addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

function Register() {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        error: "",
        loading: false,
    })

    const navigate = useNavigate()

    const { name, email, password, confirmPassword, error, loading } = values

    const handleChange = e => setValues({ ...values, [e.target.name]: e.target.value })

    const handleSubmit = async e => {
        e.preventDefault()

        if (!name || !email || !password || !confirmPassword) {
            setValues({ ...values, error: "All fields are required" })
            return
        }

        if (password !== confirmPassword) {
            setValues({ ...values, error: "Password should be match" })
            return
        }

        setValues({ ...values, error: '', loading: true })

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)

            await setDoc(doc(db, 'users', result.user.uid), {
                uid: result.user.uid,
                name: name,
                email: email,
                createdAt: Timestamp.fromDate(new Date()),
                inOnline: true,
            })

            setValues({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                error: "",
                loading: false,
            })

            navigate('/dashboard')

        } catch (error) {
            setValues({ ...values, error: error.message, loading: false })
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className=" box-border border-2 lg:px-8 lg:py-8 w-full lg:w-100 
            rounded-lg md:w-2/6 lg:w-2/6 mx-auto mt-5 flex flex-col mt-8 drop-shadow-lg">
                <h2 className="text-lg lg:text-4xl semibold font-mono mx-auto">
                    Register
                </h2>

                <input type="text" name="name"
                    className="rounded-full mt-5 bg-gray-100 w-11/12 lg:w-3/4 px-3 py-1 lg:px-6 lg:py-3 mx-auto"
                    placeholder="Name" value={name} onChange={handleChange} />

                <input type="email" name="email"
                    className="rounded-full mt-5 bg-gray-100 w-11/12 lg:w-3/4 px-3 py-1 lg:px-6 lg:py-3 mx-auto"
                    placeholder="Email" value={email} onChange={handleChange} />

                <input type="password" name="password"
                    className="rounded-full mt-5 bg-gray-100 w-11/12 lg:w-3/4 px-3 py-1 lg:px-6 lg:py-3 mx-auto"
                    placeholder="Password" value={password} onChange={handleChange} />


                <input type="password" name="confirmPassword"
                    className="rounded-full mt-5 bg-gray-100 w-11/12 lg:w-3/4 px-3 py-1 lg:px-6 lg:py-3 mx-auto"
                    placeholder="Confirm Password" value={confirmPassword} onChange={handleChange} />
                {error ? <p className='text-center text-red-500 mt-5'>{error}</p> : null}
                <div className="flex flex-row my-5 mx-auto">

                    <button
                        className="border-y rounded-md w-40 border-slate-500 px-3 py-3 hover:shadow-lg hover:border-x">Register</button>
                    <input type="reset"
                        className="ml-5 border-y rounded-md border-slate-500 px-3 py-3 hover:shadow-lg hover:border-x"
                        value="Clear" />
                </div>

            </form>
        </div>
    )
}

export default Register