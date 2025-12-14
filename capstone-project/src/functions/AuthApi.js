import axios from "axios";

export const UserLogin = async ({loginForm, base_url}) => {
    console.log(base_url)
    try {
        const response = await axios.post(`${base_url}login`, loginForm, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Login API error:", error.response?.data || error);
        throw error;
    }
};

export const UserLogout = async ({ base_url, token }) => {
    try {
        const response = await axios.post(`${base_url}logout`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const blockUser = async ({ base_url, token, userId }) => {
    try {
        const response = await axios.put(
            `${base_url}block/user/${userId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const unBlockUser = async ({ base_url, token, userId }) => {
    try {
        const response = await axios.put(
            `${base_url}unBlock/user/${userId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const changePassword = async ({ base_url, token, formData, userId }) => {
    try {
        const response = await axios.put(
            `${base_url}users/${userId}`,
            {password: formData.newPassword},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};