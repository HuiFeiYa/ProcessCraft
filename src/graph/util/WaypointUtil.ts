import { Shape } from "../types";
import { Point } from "./Point";

export function int(num: number | string) {
    return Math.round(+num);
}
export class WaypointUtil {

    /**
     * 根据线的style和waypoint生成svgpath
     * @param edgeShape
     */
    getSvgPath(previewEdge: Shape): string {
        if (!previewEdge.waypoint.length) { return ''; }
        let result = '';
        const pts = previewEdge.waypoint;
        // console.log(pts);
        let path = `M ${int(pts[0].x)} ${int(pts[0].y)}`;

        pts.forEach((point, index) => {
            if (index === 0) return;
            path += ` L ${int(point.x)} ${int(point.y)}`;
        })

        result = path;

        return result;
    }
}

export const waypointUtil = new WaypointUtil()