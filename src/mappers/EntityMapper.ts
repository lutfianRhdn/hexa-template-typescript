import { MapperUtil } from "./MapperUtil";
import { EntityMapConfig, FieldMapping, RelationMapping } from "../adapters/postgres/repositories/Repository";

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
    this.mapFields(dbData, entity);
    this.mapRelations(dbData, entity);
    return entity as T;
  }

  public mapToEntities(dbRecords: TDbRecord[]): T[] {
    return dbRecords.map(record => this.mapToEntity(record));
  }

  private mapFields(dbData: Record<string, unknown>, entity: Partial<T>): void {
    for (const fieldMap of this.mapConfig.fields) {
      const dbValue = dbData[fieldMap.dbField];
      entity[fieldMap.entityField as keyof T] = this.transformField(dbValue, fieldMap) as T[keyof T];
    }
  }

  private transformField<TValue>(value: TValue, fieldMap: FieldMapping): TValue | unknown {
    return fieldMap.transform ? fieldMap.transform(value) : value;
  }

  private mapRelations(dbData: Record<string, unknown>, entity: Partial<T>): void {
    if (!this.mapConfig.relations) return;
    for (const relationMap of this.mapConfig.relations) {
      const dbRelation = dbData[relationMap.dbField];
      entity[relationMap.entityField as keyof T] = this.transformRelation(dbRelation, relationMap) as T[keyof T];
    }
  }

  private transformRelation<TRel>(value: TRel | TRel[], relationMap: RelationMapping): unknown {
    if (relationMap.isArray) return MapperUtil.mapRelationArray(value as TRel[], relationMap.mapper);
    return MapperUtil.mapRelation(value as TRel, relationMap.mapper);
  }
}
