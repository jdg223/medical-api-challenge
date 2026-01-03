export interface EntityMapper<Entity, DTO> {
    toDomain(dto: DTO): Entity;
}