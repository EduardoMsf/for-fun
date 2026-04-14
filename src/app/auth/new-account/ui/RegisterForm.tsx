'use client';
import { useForm, SubmitHandler } from 'react-hook-form';

import Link from 'next/link';
import clsx from 'clsx';
import { login, registerUser } from '@/src/actions';
import { useState } from 'react';

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMessage('');
    const { name, email, password } = data;
    const resp = await registerUser(name, email, password);
    if (!resp.ok) {
      setErrorMessage(resp.message ?? '');
    }

    await login(email.toLowerCase(), password);
    window.location.replace('/');
  };
  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Full Name</label>
      <input
        className={clsx('px-5 py-2 bg-gray-200 rounded mb-5 border', {
          'border-red-500': !!errors.name,
          'border-transparent': !errors.name, // evita que el layout "salte" al aparecer
        })}
        type="text"
        {...register('name', { required: true })}
      />

      <label htmlFor="email">Email</label>
      <input
        className={clsx('px-5 py-2 bg-gray-200 rounded mb-5 border', {
          'border-red-500': !!errors.email,
          'border-transparent': !errors.email, // evita que el layout "salte" al aparecer
        })}
        type="email"
        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
      />

      <label htmlFor="password">Password</label>
      <input
        className={clsx('px-5 py-2 bg-gray-200 rounded mb-5 border', {
          'border-red-500': !!errors.password,
          'border-transparent': !errors.password, // evita que el layout "salte" al aparecer
        })}
        type="password"
        {...register('password', { required: true, minLength: 8 })}
      />

      {errorMessage && <span>{errorMessage}</span>}

      <button className="btn-primary" type="submit">
        Create Account
      </button>

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Have an account? Sign in
      </Link>
    </form>
  );
};
