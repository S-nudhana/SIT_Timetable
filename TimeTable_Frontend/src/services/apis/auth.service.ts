import axiosInstance from "../axios/axiosInstance";

export async function Login(username: string, password: string) {
    const res = await axiosInstance.post("/user/login", { Email: username, Password: password });
    if (res.status === 200) {
        return res;
    }
    throw new Error("Error logging in");
}

export async function AuthorizeAPI() {
    const res = await axiosInstance.get("/user/authorize");
    if (res.status === 200) {
        return res;
    }
    throw new Error("Error authorizing user");
}

export async function Logout() {
    const res = await axiosInstance.get("/user/logout");
    if (res.status === 200) {
        return res;
    }
    throw new Error("Error logging out");
}