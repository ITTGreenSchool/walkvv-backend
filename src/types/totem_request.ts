type TotemRequest = {
    id: number;
    points: number;
    latitude: number;
    longitude: number;
}

type TotemUpdateRequest = {
    id: number;
    updated_data: {
        points?: number;
        latitude?: number;
        longitude?: number;
    };
}

export { TotemRequest, TotemUpdateRequest };