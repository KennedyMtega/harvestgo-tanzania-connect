import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const AuthTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      alert('User created: ' + userCredential.user.email);
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' type='password' />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default AuthTest; 