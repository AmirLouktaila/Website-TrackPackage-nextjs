import TrackingResults from "../components/TrackingResults"
import { trackAll } from "../api/track_api"
export default async function getapitreck({ params }) {
    const idnum = params.id
    
    const result = await trackAll(idnum)

    const trackingData = typeof result === 'string' ? JSON.parse(result) : result;

    <TrackingResults data={trackingData} />

    return (
        <div>
            <TrackingResults data={trackingData}  />
        </div>
    )
}