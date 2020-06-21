import React, { Dispatch } from 'react';

interface RoadContextData {
    roadName: string,
    roadCoord: [number, number],
    setRoadName: Dispatch<string>,
    setRoadCoord: Dispatch<[number, number]>,
}

const RoadContext = React.createContext<RoadContextData>({
    roadName: "",
    roadCoord: [0, 0],
    setRoadName: () => { },
    setRoadCoord: () => { },
});

export default RoadContext;