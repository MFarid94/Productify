import { useAuth, useUser } from "@clerk/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { syncUser } from "../lib/api";

function useUserSync() {
    const { user } = useUser();
    const { isSignedIn } = useAuth();

    const {mutate: syncUserMutation, isPending, isSuccess} = useMutation({ mutationFn: syncUser });

    useEffect(() => {
        const email = user?.primaryEmailAddress?.emailAddress;
        if (!email) return;

        if (isSignedIn && user && !isPending && !isSuccess) {
            syncUserMutation({
                email,
                name: user.fullName || user.firstName,
                imageUrl: user.imageUrl,
            });
        }
    }, [isSignedIn, user, syncUserMutation, isPending, isSuccess]);

    return { isSynced: isSuccess };
}

export default useUserSync