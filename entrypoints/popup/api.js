import axios from "axios";

export async function getTwitterAuthUrl() {
    const response = await axios.get("https://localhost:5005/api/auth/twitter/url");
    return response.data.url;
}