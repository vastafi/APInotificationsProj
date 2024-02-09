import dayjs from 'dayjs/esm';

import { IReport, NewReport } from './report.model';

export const sampleWithRequiredData: IReport = {
  id: 1181,
  generatedDate: dayjs('2024-02-07T12:28'),
};

export const sampleWithPartialData: IReport = {
  id: 27063,
  generatedDate: dayjs('2024-02-06T17:12'),
};

export const sampleWithFullData: IReport = {
  id: 23929,
  generatedDate: dayjs('2024-02-07T05:13'),
};

export const sampleWithNewData: NewReport = {
  generatedDate: dayjs('2024-02-07T02:29'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
