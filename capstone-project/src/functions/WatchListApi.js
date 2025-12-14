import axios from "axios";

export const CreateWatchList = async ({ base_url, token, form }) => {
    try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("type", form.type);
        formData.append("identifier", form.identifier);
        formData.append("details", form.details);
        formData.append("reason", form.reason);

        if (form.image) {
            formData.append("image", form.image); 
        }

        const response = await axios.post(
            `${base_url}watch-list`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "AddWatchList API Error:",
            error.response || error.message
        );
        throw error;
    }
};

export const getWatchList = async ({base_url, token}) => {
    try {
        const response = await axios.get(`${base_url}watch-list`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.watchList;
    } catch (error) {
        console.log(error);
    }
}

export const getWatchListDetails = async ({base_url, token, id}) => {
    try {
        const response = await axios.get(`${base_url}watch-list/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.details;
    } catch (error) {
        console.log(error);
    }
}

export const updateStatus = async ({ base_url, token, id}) => {
    try {
        const response = await axios.put(`${base_url}watch-list/${id}`, 
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.status
    } catch (error) {
        console.log(error);
    }
}