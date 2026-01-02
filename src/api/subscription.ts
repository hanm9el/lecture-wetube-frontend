import { api } from "./axios.ts";

    const response = await api.post<{ isSubscribed: boolean }>(`/subscriptions/${channelId}`);
    return response.data;