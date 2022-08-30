import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
    state: () => ({
        LoggedIn: false,
        UserId: "123",
        rol: 0
    })
});