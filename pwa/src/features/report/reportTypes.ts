export type ReportStatus = 'good' | 'attention' | 'critical' | 'inconclusive';

export interface ReportSection {
  body: string;
  title: string;
}

export interface Report {
  id: string;
  historyEntryId: string;
  localOnly: true;
  sections: ReportSection[];
  sourceDataRefs: string[];
  status: ReportStatus;
  summary: string;
  timestampEpochMs: number;
  title: string;
}
