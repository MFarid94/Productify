import { useAuth } from "@clerk/react"
import { useEffect } from "react"
import api from "../lib/axios";

let isInterceptorRegistered = false;

function useAuthReq() {
    const { isSignedIn, getToken, isLoaded } = useAuth();

    useEffect(() => {
        if (isInterceptorRegistered) return;
        isInterceptorRegistered = true;

        const interceptor = api.interceptors.request.use(async (config) => {
            if (isSignedIn) {
            try {
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Failed to fetch Clerk token:", error);
                // Optionally: decide whether to proceed without token or reject the request
             }
            }
            return config;
        });

        return () => {
            api.interceptors.request.eject(interceptor);
            isInterceptorRegistered = false;
        };
    }, [isSignedIn, getToken]);

    return { isSignedIn, isClerkLoaded: isLoaded };
}

export default useAuthReq