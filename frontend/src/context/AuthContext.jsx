import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth";

import { auth } from "../firebase";

const AuthContext = createContext();

const provider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            // premium fetch logic

            setLoading(false);
        });

        return unsub;
    }, []);

    const login = () => signInWithPopup(auth, provider);
    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider
            value={{
                user,
                isPremium,
                login,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);