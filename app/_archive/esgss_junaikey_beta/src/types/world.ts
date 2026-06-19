export type LocationID = string;

export interface WorldCoordinates {
  x: number;
  y: number;
}

export interface WorldLocation {
  id: LocationID;
  name: string;
  description: string;
  partnerId: string;
  coordinates: WorldCoordinates;
  availableActions: string[];
}
