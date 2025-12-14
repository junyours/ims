import axios from "axios"

export const getTanodUser = async({base_url, token}) => {
    try {
        const response = await axios.get(`${base_url}users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data.users ?? [];
    } catch (error) {
         console.error("Fetching data error:", error);
         return [];
    }
}

export const createTanodAccount = async ({base_url, token, accountForm }) => {
    try {
        const response = await axios.post(`${base_url}users`, accountForm, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data.user
    } catch (error) {
         if (error.response) {
             console.error("Laravel Error:", error.response.data);
         } else {
             console.error("Axios Error:", error.message);
         }
         throw error;
    }
}

export const respondersRecords = async ({base_url, token, id}) => {
    try {
        const response = await axios.get(
            `${base_url}responders/records/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.records ?? [];
    } catch (error) {
        console.error("Fetching data error:", error);
        throw error; 
    }
}

export const respondersStats = async ({base_url, token, id}) => {
    try {
        const response = await axios.get(`${base_url}responders/stats/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data ?? [];
    } catch (error) {
        console.error("Fetching data error:", error);
        throw error;  
    }
}