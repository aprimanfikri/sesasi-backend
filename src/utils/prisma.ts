type PrismaErrorCode =
  | 'P2000'
  | 'P2001'
  | 'P2002'
  | 'P2003'
  | 'P2004'
  | 'P2005'
  | 'P2006'
  | 'P2007'
  | 'P2008'
  | 'P2009'
  | 'P2010'
  | 'P2011'
  | 'P2012'
  | 'P2013'
  | 'P2014'
  | 'P2015'
  | 'P2016'
  | 'P2017'
  | 'P2018'
  | 'P2019'
  | 'P2020'
  | 'P2021'
  | 'P2022'
  | 'P2023'
  | 'P2024'
  | 'P2025'
  | 'P2026'
  | 'P2027'
  | 'P2028';

export const isPrismaErrorCode = (code: string): code is PrismaErrorCode => {
  return [
    'P2000',
    'P2001',
    'P2002',
    'P2003',
    'P2004',
    'P2005',
    'P2006',
    'P2007',
    'P2008',
    'P2009',
    'P2010',
    'P2011',
    'P2012',
    'P2013',
    'P2014',
    'P2015',
    'P2016',
    'P2017',
    'P2018',
    'P2019',
    'P2020',
    'P2021',
    'P2022',
    'P2023',
    'P2024',
    'P2025',
    'P2026',
    'P2027',
    'P2028',
  ].includes(code);
};

export const prismaErrorMessage = (code: PrismaErrorCode): string => {
  const messages: Record<PrismaErrorCode, string> = {
    P2000: 'Value too long for column type',
    P2001: 'Record not found',
    P2002: 'Unique constraint failed',
    P2003: 'Foreign key constraint failed',
    P2004: 'Constraint failed',
    P2005: 'Invalid value stored in database',
    P2006: 'Invalid value for field',
    P2007: 'Data validation error',
    P2008: 'Failed to parse query',
    P2009: 'Query validation error',
    P2010: 'Raw query execution failed',
    P2011: 'Null constraint violation',
    P2012: 'Missing required value',
    P2013: 'Missing required argument',
    P2014: 'Relation violation',
    P2015: 'Related record not found',
    P2016: 'Query interpretation error',
    P2017: 'Records not connected',
    P2018: 'Required connected records not found',
    P2019: 'Input error',
    P2020: 'Value out of range',
    P2021: 'Table does not exist',
    P2022: 'Column does not exist',
    P2023: 'Inconsistent column data',
    P2024: 'Query timeout',
    P2025: 'Record to update/delete not found',
    P2026: 'Feature not supported by database',
    P2027: 'Multiple errors occurred',
    P2028: 'Transaction API error',
  };

  return messages[code] ?? 'Unknown Prisma error';
};
