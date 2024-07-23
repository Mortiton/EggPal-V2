import { create } from 'zustand'

const userStore = create((set) => ({
    user: null, //user variable
    setUser: (user) => set({ user }), // action that sets the user
    clearUser: () => set({ user:null }) // action that clears the user
}));

export default userStore