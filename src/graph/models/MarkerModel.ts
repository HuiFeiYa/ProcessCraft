import { Shape } from "../types";
import { Marker } from "./Marker";
import { GraphModel } from "./graphModel";

/**
 * 管理所有标亮效果
 */
export class MarkerModel {
    markerMap = new Map<string, Marker>()

    constructor(public graph: GraphModel) { }

    addMarker(marker: Marker) {
        if (this.markerMap.has(marker.id)) return;
        this.markerMap.set(marker.id, marker);

    }

    createMarker(shape: Shape, strokeColor: string, width = 2) {
        const m = new Marker(shape, strokeColor, width);
        this.addMarker(m);
        return m;

    }

    getMarker(id: string) {
        return this.markerMap.get(id);
    }
    removeMarker(id: string) {
        this.markerMap.delete(id);

    }

    removeMarkerByType(type: string) {
        this.markerMap.forEach(marker => {
            if (marker.type === type || marker.type?.includes('simulation')) {
                this.removeMarker(marker.id);
            }
        });

    }
    removeMarkerByTargetShape(shapeId: string) {
        this.markerMap.forEach(marker => {
            if (marker.targetShape?.id === shapeId) {
                this.removeMarker(marker.id);
            }
        });

    }
    hasMarker(id: string) {
        return this.markerMap.has(id);
    }
}