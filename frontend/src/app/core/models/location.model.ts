export interface District {
    id: string;
    name: string;
    createdAt: string;
}

export interface Constituency {
    id: string;
    name: string;
    districtId: string;
    createdAt: string;
    district?: District;
}

export interface Mandal {
    id: string;
    name: string;
    constituencyId: string;
    createdAt: string;
    constituency?: Constituency;
}
