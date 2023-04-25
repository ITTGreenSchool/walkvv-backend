type FootpathRequest = {
    id: number;
    name: string;
    description: string;
    difficulty: number;
    length: number;
    images: string[];
    starting_totem: number;
    ending_totem: number;
}

export default FootpathRequest;