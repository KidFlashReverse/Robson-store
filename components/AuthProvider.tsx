import nookies from 'nookies';
import { useState } from 'react';

export default function AuthProvider({children}: {children: React.ReactNode}) {
    const cookies = nookies.get();
    const [uid, setUid] = useState(cookies.uid);

    return children;
}