
export class MapperUtil {
  static mapId(id: number | string): string {
    return typeof id === 'number' ? id.toString() : id;
  }

  static snakeToCamel(snakeCase: string): string {
    return snakeCase.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  static camelToSnake(camelCase: string): string {
    return camelCase.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  static mapRelation<TInput, TOutput>(
    relation: TInput | null | undefined,
    mapper: (rel: TInput) => TOutput
  ): TOutput | null {
    return relation ? mapper(relation) : null;
  }

  static mapRelationArray<TInput, TOutput>(
    relations: TInput[] | null | undefined,
    mapper: (rel: TInput) => TOutput
  ): TOutput[] {
    return relations ? relations.map(mapper) : [];
  }
}
