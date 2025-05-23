import { redirect } from "@tanstack/react-router";
import { getCurrentUser } from "../api/user.api";
import { login } from "../store/slice/authSlice";

export const checkAuth = async ({ context }) => {
    try {
        const { queryClient, store } = context;
        
        // Try to get current user from server
        const response = await queryClient.ensureQueryData({
            queryKey: ["currentUser"],
            queryFn: getCurrentUser,
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: false
        });
        
        if (!response?.user) {
            console.log('No user found in response');
            throw new Error('No user data');
        }
        
        // Update Redux store with user data
        store.dispatch(login(response.user));
        
        // Check if user is properly authenticated in store
        const { isAuthenticated } = store.getState().auth;
        if (!isAuthenticated) {
            console.log('User not authenticated in store');
            throw new Error('Not authenticated');
        }
        
        console.log('User authenticated successfully:', response.user.name);
        return true;
        
    } catch (error) {
        console.log('Authentication check failed:', error.message);
        
        // Clear any stale user data
        const { store } = context;
        store.dispatch({ type: 'auth/logout' });
        
        // Redirect to auth page
        throw redirect({ to: "/auth" });
    }
};