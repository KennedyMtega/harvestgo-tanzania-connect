import React, { useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const FirestoreTest = () => {
  useEffect(() => {
    async function fetchVendors() {
      const querySnapshot = await getDocs(collection(db, 'vendors'));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
    }
    fetchVendors();
  }, []);

  return <div>Check the console for Firestore data!</div>;
};

export default FirestoreTest; 