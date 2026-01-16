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
