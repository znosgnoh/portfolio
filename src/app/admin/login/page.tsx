'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const StyledLoginPage = styled.div`
  ${({ theme }) => theme.mixins.flexCenter};
  min-height: 100vh;
  background-color: var(--navy);

  .login-form {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);

    h1 {
      color: var(--lightest-slate);
      margin-bottom: 2rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        color: var(--light-slate);
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        margin-bottom: 0.5rem;
      }

      input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid var(--lightest-navy);
        border-radius: var(--border-radius);
        background-color: var(--navy);
        color: var(--lightest-slate);
        font-size: var(--fz-md);

        &:focus {
          border-color: var(--green);
          outline: none;
        }
      }
    }

    button {
      ${({ theme }) => theme.mixins.bigButton};
      width: 100%;
    }

    .error {
      color: #ff6b6b;
      font-size: var(--fz-sm);
      text-align: center;
      margin-top: 1rem;
    }
  }
`;

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/admin');
    }
  };

  return (
    <StyledLoginPage>
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign In</button>
        {error && <p className="error">{error}</p>}
      </form>
    </StyledLoginPage>
  );
}
