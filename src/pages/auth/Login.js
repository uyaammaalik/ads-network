import React, { useState } from 'react'
import { auth, db } from '../../firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
    })

    const navigate = useNavigate()

    const { email, password, error, loading } = values

    const handleChange = e => setValues({ ...values, [e.target.name]: e.target.value })

    const handleSubmit = async e => {
        e.preventDefault()

        if (!email || !password) {
            setValues({ ...values, error: "All fields are required" })
            return
        }

        setValues({ ...values, error: '', loading: true })

        try {
            const result = await signInWithEmailAndPassword(auth, email, password)

            await updateDoc(doc(db, 'users', result.user.uid), {
                inOnline: true,
            })

            setValues({
                email: "",
                password: "",
                error: "",
                loading: false,
            })

            navigate('/dashboard', { replace: true })

        } catch (error) {
            setValues({ ...values, error: error.message, loading: false })
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className=" box-border border-2 lg:px-8 lg:py-8 w-full lg:w-100 
            rounded-lg md:w-2/6 lg:w-2/6 mx-auto mt-5 flex flex-col mt-8 drop-shadow-lg">
                <h2 className="text-lg lg:text-4xl semibold font-mono mx-auto">
                    Login
                </h2>

                <input type="email" name="email"
                    className="rounded-full mt-5 bg-gray-100 w-11/12 lg:w-3/4 px-3 py-1 lg:px-6 lg:py-3 mx-auto"
                    placeholder="Email" value={email} onChange={handleChange} />

                <input type="password" name="password"
                    className="rounded-full mt-5 bg-gray-100 w-11/12 lg:w-3/4 px-3 py-1 lg:px-6 lg:py-3 mx-auto"
                    placeholder="Password" value={password} onChange={handleChange} />
                {error ? <p className='text-center text-red-500 mt-5'>{error}</p> : null}
                <div className="flex flex-row my-5 mx-auto">

                    <button
                        className="border-y rounded-md w-40 border-slate-500 px-3 py-3 hover:shadow-lg hover:border-x">Login</button>
                    <input type="reset"
                        className="ml-5 border-y rounded-md border-slate-500 px-3 py-3 hover:shadow-lg hover:border-x"
                        value="Clear" />
                </div>
                <Link className='text-md text-center' to='/auth/forgot-password'>Forgot Password</Link>

            </form>
        </div>
    )
}

export default Login