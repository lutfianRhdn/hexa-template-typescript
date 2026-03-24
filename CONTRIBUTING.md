# Panduan Kontribusi

## Konvensi Penamaan

| Artefak | Konvensi | Contoh |
|---|---|---|
| Entity type | `T<Nama>` | `TProduct` |
| Entity + ID | `T<Nama>WithID` | `TProductWithID` |
| Repository interface | `<Nama>Repository` | `ProductRepository` |
| Service | `<Nama>Service` | `ProductService` |
| Controller | `<Nama>Controller` | `ProductController` |
| Router file | `<nama>.router.ts` | `products.router.ts` |
| Validation | `<nama>.validation.ts` | `product.validation.ts` |
| DB table | `snake_case` | `@@map("products")` |
| API endpoint | `kebab-case` plural | `/api/v1/products` |

## Checklist Menambah Resource Baru

- [ ] Entity types di `src/core/entities/`
- [ ] Repository interface di `src/core/repositories/`
- [ ] Map config di `src/adapters/postgres/repositories/mapConfigs.ts`
- [ ] Repository implementation
- [ ] Service
- [ ] Response Mapper
- [ ] Controller
- [ ] Zod Validation
- [ ] Router
- [ ] Daftarkan router di index
- [ ] Update Prisma schema jika perlu
- [ ] `bun run build` — pastikan tidak ada error

## Commit Convention

Gunakan format: `<type>(<scope>): <message>`

- `feat(product): add product listing endpoint`
- `fix(auth): fix JWT expiry handling`
- `refactor(batch): extract correction logic to service`
- `docs(readme): update installation steps`
