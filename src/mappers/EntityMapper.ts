import { EntityMapConfig } from '../adapters/postgres/repositories/Repository';

export class EntityMapper<T, TDbRecord = Record<string, unknown>> {
  private mapConfig: EntityMapConfig;

  constructor(mapConfig: EntityMapConfig) {
    this.mapConfig = mapConfig;
  }

  public getIncludes(): Record<string, boolean | object> | undefined {
    if (!this.mapConfig.relations || this.mapConfig.relations.length === 0) return undefined;
    const includes: Record<string, boolean | object> = {};
    for (const relation of this.mapConfig.relations) {
      includes[relation.dbField] = relation.include !== undefined ? relation.include : true;
    }
    return includes;
  }

  public mapToEntity(dbRecord: TDbRecord): T {
    const dbData = dbRecord as Record<string, unknown>;
    const entity: Partial<T> = {};
    for (const fieldMap of this.mapConfig.fields) {
      const dbValue = dbData[fieldMap.dbField];
      entity[fieldMap.entityField as keyof T] = (fieldMap.transform ? fieldMap.transform(dbValue) : dbValue) as T[keyof T];
    }
    if (this.mapConfig.relations) {
      for (const relationMap of this.mapConfig.relations) {
        const dbRelation = dbData[relationMap.dbField];
        if (relationMap.isArray) {
          entity[relationMap.entityField as keyof T] = (dbRelation ? (dbRelation as unknown[]).map(relationMap.mapper) : []) as T[keyof T];
        } else {
          entity[relationMap.entityField as keyof T] = (dbRelation ? relationMap.mapper(dbRelation) : null) as T[keyof T];
        }
      }
    }
    return entity as T;
  }

  public mapToEntities(dbRecords: TDbRecord[]): T[] {
    return dbRecords.map(record => this.mapToEntity(record));
  }
}
