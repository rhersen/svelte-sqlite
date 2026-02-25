export interface Train {
	OperationalTrainNumber: string;
	OperationalTrainDepartureDate: string;
	JourneyPlanNumber?: string;
	JourneyPlanDepartureDate?: string;
	AdvertisedTrainNumber?: string;
}

export interface Position {
	SWEREF99TM?: string; // WKT format: "POINT (x y)"
	WGS84?: string; // WKT format: "POINT (lon lat)"
}

export interface PositionRecord {
	Train: Train;
	Position: Position;
	TimeStamp: string;
	Bearing?: number;
	Speed?: number;
}

export interface TrafikverketInfo {
	SSEURL: string;
}

export interface TrafikverketResultItem {
	TrainPosition?: PositionRecord[];
	INFO: TrafikverketInfo;
}

export interface TrafikverketResponseData {
	RESULT: TrafikverketResultItem[];
}

export interface TrafikverketResponse {
	RESPONSE: TrafikverketResponseData;
}

export interface DatabaseStats {
	positions: number;
	lastPosition?: string;
}

export interface StationGeometry {
	SWEREF99TM?: string;
	WGS84?: string;
}

export interface TrainStation {
	LocationSignature: string;
	Advertised?: boolean;
	AdvertisedLocationName?: string;
	AdvertisedShortLocationName?: string;
	PrimaryLocationCode?: string;
	CountryCode?: string;
	CountyNo?: number[];
	Deleted?: boolean;
	Geometry?: StationGeometry;
	PlatformLine?: string[];
	Prognosticated?: boolean;
	OfficialLocationName?: string;
	ModifiedTime?: string;
}

export interface TrafikverketError {
	SOURCE?: string;
	MESSAGE?: string;
}

export interface TrafikverketLastModified {
	datetime?: string;
}

export interface TrafikverketEvalResult {
	[key: string]: unknown;
}

export interface TrafikverketInfoExtended {
	LASTMODIFIED?: TrafikverketLastModified;
	LASTCHANGEID?: string;
	EVALRESULT?: TrafikverketEvalResult[];
	SSEURL?: string;
}

export interface TrafikverketStationResultItem {
	TrainStation?: TrainStation[];
	ERROR?: TrafikverketError;
	INFO?: TrafikverketInfoExtended;
	id?: string;
}

export interface TrafikverketStationResponseData {
	RESULT: TrafikverketStationResultItem[];
}

export interface TrafikverketStationResponse {
	RESPONSE: TrafikverketStationResponseData;
}
