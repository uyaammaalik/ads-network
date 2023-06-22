import React, { useState } from 'react'
import { auth, db } from '../../firebaseConfig'
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const navigate = useNavigate()


    const handleSubmit = async e => {
        e.preventDefault()

        if (!email) {
            setError('Email is required!')
            return
        }

        setError('')
        setSuccess(false)

        try {
            await sendPasswordResetEmail(auth, email)

            setSuccess(true)
            setEmail('')

        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className=" box-border border-2 lg:px-8 lg:py-8 w-full lg:w-100 
            rounded-lg md:w-2/6 lg:w-2/6 mx-auto mt-5 flex flex-col mt-8 drop-shadow-lg">
                <h2 className="text-lg lg:text-4xl semibold font-mono mx-auto">
                    Forgot Password
                </h2>
                {success ? <p className='text-center'>An e-mail sent containing password reset instructions</p> : <>

                    <input type="email" name="email"
                        className="rounded-full mt-5 bg-gray-100 w-11/12 lg:w-3/4 px-3 py-1 lg:px-6 lg:py-3 mx-auto"
                        placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />


                    {error ? <p className='text-center text-red-500 mt-5'>{error}</p> : null}
                    <div className="flex flex-row my-5 mx-auto">

                        <button
                            className="border-y rounded-md w-40 border-slate-500 px-3 py-3 hover:shadow-lg hover:border-x">Send</button>
                        <input type="reset"
                            className="ml-5 border-y rounded-md border-slate-500 px-3 py-3 hover:shadow-lg hover:border-x"
                            value="Clear" />
                    </div>
                </>}

            </form>
        </div>
    )
}

export default ForgotPassword